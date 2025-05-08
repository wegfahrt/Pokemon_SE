using Application.Common;
using Contracts.Pokemons;
using ErrorOr;
using MediatR;
using PokeApiNet;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Pokemons.Queries.GetPokemonDetails;

public class GetPokemonDetailsQueryHandler : IRequestHandler<GetPokemonDetailsQuery, ErrorOr<PokemonDetailedResponse>>
{
    private readonly ILogger<GetPokemonDetailsQueryHandler> _logger;

    public GetPokemonDetailsQueryHandler(ILogger<GetPokemonDetailsQueryHandler> logger)
    {
        _logger = logger;
    }

    public async Task<ErrorOr<PokemonDetailedResponse>> Handle(GetPokemonDetailsQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting details for Pokemon: {PokemonName}", request.Name);
        
        var pokeClient = new CustomPokeApiClient();

        try
        {
            // Get the main Pokemon data
            var pokemon = await pokeClient.GetResourceAsync<Pokemon>(request.Name, cancellationToken);

            if (pokemon is null)
            {
                _logger.LogWarning("Pokemon not found: {PokemonName}", request.Name);
                return Error.NotFound(description: "Pokemon not found");
            }

            _logger.LogInformation("Successfully retrieved Pokemon: {PokemonName}, ID: {PokemonId}", pokemon.Name, pokemon.Id);

            // Extract all unique move names
            var moveNames = pokemon.Moves.Select(m => m.Move.Name).Distinct().ToList();
            _logger.LogInformation("Found {MoveCount} unique moves", moveNames.Count);

            // Process moves in batches to prevent overwhelming the API
            var moveDict = new Dictionary<string, Move>();
            const int batchSize = 10; // Adjust based on API limitations
            
            for (int i = 0; i < moveNames.Count; i += batchSize)
            {
                _logger.LogDebug("Processing move batch {BatchNumber}/{TotalBatches}", 
                    (i / batchSize) + 1, (int)Math.Ceiling(moveNames.Count / (double)batchSize));
                
                var currentBatch = moveNames.Skip(i).Take(batchSize).ToList();
                
                // Create a list to track failed moves
                var failedMoves = new List<string>();
                var moveTasks = new List<Task<Move>>();
                
                foreach (var name in currentBatch)
                {
                    // Add a small delay between requests to avoid overwhelming the API
                    await Task.Delay(50, cancellationToken);
                    
                    var moveTask = FetchMoveWithRetry(pokeClient, name, cancellationToken);
                    moveTasks.Add(moveTask);
                }
                
                // Wait for current batch to complete
                try
                {
                    var results = await Task.WhenAll(moveTasks);
                    
                    // Add successful results to dictionary
                    foreach (var move in results.Where(m => m != null))
                    {
                        if (!moveDict.ContainsKey(move.Name))
                        {
                            moveDict[move.Name] = move;
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing move batch");
                    // Continue processing other batches even if this one had errors
                }
            }

            _logger.LogInformation("Successfully retrieved {SuccessfulMoves} out of {TotalMoves} moves", 
                moveDict.Count, moveNames.Count);

            // Create move details only for moves we successfully retrieved
            var moveDetails = new List<MoveDetail>();
            foreach (var moveEntry in pokemon.Moves)
            {
                var moveName = moveEntry.Move.Name;
                if (moveDict.TryGetValue(moveName, out var move))
                {
                    moveDetails.Add(new MoveDetail(
                        Name: move.Name,
                        Type: move.Type?.Name ?? "unknown",
                        Power: move.Power,
                        Accuracy: move.Accuracy,
                        PP: move.Pp,
                        DamageClass: move.DamageClass?.Name ?? "unknown"
                    ));
                }
                else
                {
                    // Add a placeholder for moves we couldn't fetch
                    _logger.LogWarning("Could not retrieve details for move: {MoveName}", moveName);
                    moveDetails.Add(new MoveDetail(
                        Name: moveName,
                        Type: "unknown",
                        Power: null,
                        Accuracy: null,
                        PP: null,
                        DamageClass: "unknown"
                    ));
                }
            }

            var response = new PokemonDetailedResponse(
                Id: pokemon.Id,
                Name: pokemon.Name,
                Types: pokemon.Types.Select(t => t.Type.Name).ToList(),
                Moves: moveDetails,
                PokemonStats: pokemon.Stats.Select(t => new StatDetail(t.Stat.Name, t.BaseStat)).ToList(),
                SpriteUrl: pokemon.Sprites.FrontDefault);

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving Pokemon details for {PokemonName}", request.Name);
            return Error.Failure(description: "Failed to retrieve Pokemon details: " + ex.Message);
        }
    }

    private async Task<Move> FetchMoveWithRetry(CustomPokeApiClient client, string moveName, CancellationToken cancellationToken)
    {
        const int maxRetries = 3;
        
        for (int attempt = 0; attempt < maxRetries; attempt++)
        {
            try
            {
                return await client.GetResourceAsync<Move>(moveName, cancellationToken);
            }
            catch (System.Text.Json.JsonException ex)
            {
                _logger.LogWarning(ex, "JSON parsing error fetching move {MoveName}, attempt {Attempt}/{MaxRetries}", 
                    moveName, attempt + 1, maxRetries);
                
                if (attempt == maxRetries - 1)
                    throw;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error fetching move {MoveName}, attempt {Attempt}/{MaxRetries}", 
                    moveName, attempt + 1, maxRetries);
                
                if (attempt == maxRetries - 1)
                    throw;
            }
            
            // Exponential backoff
            await Task.Delay((int)Math.Pow(2, attempt) * 200, cancellationToken);
        }
        
        return null; // Should never reach here due to the throw in the last iteration
    }
}