using Domain;

using MediatR;

using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Common.Persistence;

public class AppDbContext(DbContextOptions options, IHttpContextAccessor _httpContextAccessor, IPublisher _publisher) : DbContext(options)
{
    public virtual DbSet<ConfiguredPokemon> ConfiguredPokemons { get; set; }

    public virtual DbSet<ConfiguredMove> ConfiguredPokemonMoves { get; set; }

    public virtual DbSet<Team> TeamPresets { get; set; }
    
    public async override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // var domainEvents = ChangeTracker.Entries<Entity>()
        //    .SelectMany(entry => entry.Entity.PopDomainEvents())
        //    .ToList();
        //
        // if (IsUserWaitingOnline())
        // {
        //     AddDomainEventsToOfflineProcessingQueue(domainEvents);
        //     return await base.SaveChangesAsync(cancellationToken);
        // }
        //
        // await PublishDomainEvents(domainEvents);
        return await base.SaveChangesAsync(cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        modelBuilder.Entity<ConfiguredPokemon>(entity =>
        {
            entity.ToTable("ConfiguredPokemon");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id).HasColumnName("ConfiguredPokemonId");
            entity.Property(e => e.Name).HasColumnName("Name")
                .HasMaxLength(50)
                .IsUnicode(false);;
            entity.Property(e => e.HP).HasColumnName("HP");
            entity.Property(e => e.Attack).HasColumnName("Attack");
            entity.Property(e => e.Defense).HasColumnName("Defense");
            entity.Property(e => e.SpecialAttack).HasColumnName("SpecialAttack");
            entity.Property(e => e.SpecialDefense).HasColumnName("SpecialDefense");
            entity.Property(e => e.Speed).HasColumnName("Speed");
            entity.Property(e => e.AbilityId).HasColumnName("Ability");
            entity.Property(e => e.TeamId).HasColumnName("TeamPresetId");

            entity.HasMany(p => p.Moves)
                  .WithOne()
                  .HasForeignKey(m => m.ConfiguredPokemonId);

        });

        modelBuilder.Entity<ConfiguredMove>(entity => {
                entity.ToTable("ConfiguredPokemonMoves");
                
                entity.HasKey(e => e.Id);
                
                entity.Property(e => e.Id).HasColumnName("PokemonMoveId");
                entity.Property(e => e.MoveId).HasColumnName("MoveId");
                entity.Property(e => e.ConfiguredPokemonId).HasColumnName("ConfiguredPokemonId");
            }
        );
        
        
        modelBuilder.Entity<Team>(entity =>
        {
            entity.ToTable("TeamPreset");
            
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id).HasColumnName("TeamPresetId");
            entity.Property(e => e.Name).HasColumnName("PresetName");
            
            entity.HasMany(e => e.Pokemon).WithOne().HasForeignKey(p=> p.TeamId);
        });
        

        base.OnModelCreating(modelBuilder);
    }

    // private bool IsUserWaitingOnline() => _httpContextAccessor.HttpContext is not null;
    //
    // private async Task PublishDomainEvents(List<IDomainEvent> domainEvents)
    // {
    //     foreach (var domainEvent in domainEvents)
    //     {
    //         await _publisher.Publish(domainEvent);
    //     }
    // }

    // private void AddDomainEventsToOfflineProcessingQueue(List<IDomainEvent> domainEvents)
    // {
    //     Queue<IDomainEvent> domainEventsQueue = _httpContextAccessor.HttpContext!.Items.TryGetValue(EventualConsistencyMiddleware.DomainEventsKey, out var value) &&
    //         value is Queue<IDomainEvent> existingDomainEvents
    //             ? existingDomainEvents
    //             : new();
    //
    //     domainEvents.ForEach(domainEventsQueue.Enqueue);
    //     _httpContextAccessor.HttpContext.Items[EventualConsistencyMiddleware.DomainEventsKey] = domainEventsQueue;
    // }
}