using System;
using System.Collections.Generic;
using Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Context;

public partial class MyDbContext : DbContext
{
    public MyDbContext()
    {
    }

    public MyDbContext(DbContextOptions<MyDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ConfiguredPokemon> ConfiguredPokemons { get; set; }

    public virtual DbSet<ConfiguredPokemonMove> ConfiguredPokemonMoves { get; set; }

    public virtual DbSet<PresetPokemonRef> PresetPokemonRefs { get; set; }

    public virtual DbSet<TeamPreset> TeamPresets { get; set; }
    

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ConfiguredPokemon>(entity =>
        {
            entity.ToTable("ConfiguredPokemon");

            entity.Property(e => e.Hp).HasColumnName("HP");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ConfiguredPokemonMove>(entity =>
        {
            entity.HasKey(e => e.PokemonMoveId);

            entity.HasOne(d => d.ConfiguredPokemon).WithMany(p => p.ConfiguredPokemonMoves)
                .HasForeignKey(d => d.ConfiguredPokemonId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ConfiguredPokemonMoves_ConfiguredPokemon");
        });

        modelBuilder.Entity<PresetPokemonRef>(entity =>
        {
            entity.ToTable("PresetPokemonRef");

            entity.HasOne(d => d.ConfiguredPokemon).WithMany(p => p.PresetPokemonRefs)
                .HasForeignKey(d => d.ConfiguredPokemonId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PresetPokemonRef_ConfiguredPokemon");

            entity.HasOne(d => d.TeamPreset).WithMany(p => p.PresetPokemonRefs)
                .HasForeignKey(d => d.TeamPresetId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PresetPokemonRef_TeamPreset");
        });

        modelBuilder.Entity<TeamPreset>(entity =>
        {
            entity.ToTable("TeamPreset");

            entity.Property(e => e.PresetName)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
