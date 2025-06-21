using PokeApiNet;

namespace Infrastructure.CustomPokeApiClient;

public class CustomPokeApiClient : PokeApiClient
{
    public CustomPokeApiClient() : base(new HttpClient
    {
        BaseAddress = new Uri("http://localhost:8080/api/v2")
    })
    {

    }
}