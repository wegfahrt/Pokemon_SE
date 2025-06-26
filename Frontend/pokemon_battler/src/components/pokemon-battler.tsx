"use client"

import { useEffect, useRef, useState, type JSX } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    Zap, Shield,
    Swords, Package, User2, LogOut, Bird, Bug, Circle,
    Droplet, Eye, Flame, Ghost, Globe, HelpCircle, Leaf,
    Moon, Skull, Snowflake, Sparkles, Mountain,
    Star,
    ArrowLeft
} from "lucide-react"
import { SimplePokeballIcon } from "@/components/ui/pokeball-icon"
import type { Pokemon, Pokemon_in_battle, Moves } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"
import { calculateTypeEffectiveness, PokemonType } from "@/lib/typeEffectiveness"
import battlefieldImage from "@/assets/pokemon-battlefield.png";

import React from "react"

// All possible menu options
type MenuOption = "main" | "attack" | "pokemon" | "items" | "run"

// Props for the PokemonBattler component
type PokemonBattlerProps = {
    FullUserTeam: Pokemon[];
    FullEnemyTeam: Pokemon[];
    onEndofBattle: () => void;
}

export default function pokemon_battle({
    FullUserTeam,
    FullEnemyTeam,
    onEndofBattle
}: PokemonBattlerProps) {

    // Making the teams battle-ready 
    // This includes setting current HP, PP, and other battle-related properties
    // This is done using useMemo to avoid unnecessary recalculations on every render
    const initialUserTeam = React.useMemo(
        () => FullUserTeam.map((p) => p.makeBattleReady()),
        [FullUserTeam]
    )
    const initialEnemyTeam = React.useMemo(
        () => FullEnemyTeam.map((p) => p.makeBattleReady()),
        [FullEnemyTeam]
    )
    // Team States to manage the player's and opponent's Pokémon teams
    const [playerTeam, setPlayerTeam] = useState<Pokemon_in_battle[]>(initialUserTeam)
    const [opponentTeam, setOpponentTeam] = useState<Pokemon_in_battle[]>(initialEnemyTeam)

    // Active Pokémon Indices
    const [activePlayerIndex, setActivePlayerIndex] = useState(0)
    const [activeOpponentIndex, setActiveOpponentIndex] = useState(0)

    // Active Pokémon from the current teams
    const playerPokemon = playerTeam[activePlayerIndex]
    const opponentPokemon = opponentTeam[activeOpponentIndex]

    // Battle Text initial with current player Pokémon
    const [battleText, setBattleText] = useState(() => `What will ${playerPokemon.name} do?`)
    const firstRef = useRef(true);

    // Battle States needed to manage the Battle Flow
    const [isPlayerTurn, setIsPlayerTurn] = useState(true)
    const [isAnimating, setIsAnimating] = useState(false)
    const [currentMenu, setCurrentMenu] = useState<MenuOption>("main")
    const [showRunConfirmation, setShowRunConfirmation] = useState(false)

    // Animation States for Player
    const [isSwitchingPlayer, setIsSwitchingPlayer] = useState(false)
    const [switchingInPlayer, setSwitchingInPlayer] = useState<Pokemon_in_battle | null>(null)
    const [switchingOutPlayer, setSwitchingOutPlayer] = useState<Pokemon_in_battle | null>(null)
    const [switchDirectionPlayer, setSwitchDirectionPlayer] = useState<"in" | "out">("out")

    // Animation States for Opponent
    const [isSwitchingOpponent, setIsSwitchingOpponent] = useState(false)
    const [switchingInOpponent, setSwitchingInOpponent] = useState<Pokemon_in_battle | null>(null)
    const [switchingOutOpponent, setSwitchingOutOpponent] = useState<Pokemon_in_battle | null>(null)
    const [switchDirectionOpponent, setSwitchDirectionOpponent] = useState<"in" | "out">("out")


    // Pending Action State to manage the next action in the battle
    type PendingAction = null |
    { type: "playerMove"; move: Moves } |
    { type: "opponentMove"; move?: Moves } |
    { type: "switchPokemon"; newPokemon: Pokemon_in_battle } |
    { type: "switchOpponent"; newPokemon: Pokemon_in_battle } |
    { type: "ForcedSwitch"; newPokemon: Pokemon_in_battle }

    const [pendingAction, setPendingAction] = useState<PendingAction>(null)
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    // useEffect Hook to log the player and opponent Pokémon whenever they change
    useEffect(() => {
        console.log("Player Pokemon updated:", playerPokemon);
    }, [playerPokemon]);

    useEffect(() => {
        console.log("Opponent Pokemon updated:", opponentPokemon);
    }, [opponentPokemon]);

    //TODO Implement Speed and Priority in attack order 
    useEffect(() => {
        if (!pendingAction) return;
        // Process the pending action based on its type
        // Log the pending action to the console
        console.log("Pending action:", pendingAction);
        (async () => {
            // Processes the Player's move
            const processPlayerMove = async (move: Moves) => {
                console.log("Processing player move:", move.name);
                const first = firstRef.current;
                // Current Pokémon from both teams
                const currentOpponent = opponentTeam[activeOpponentIndex];
                const currentPlayer = playerTeam[activePlayerIndex];
                const isStatusMove = move.damageClass === "Status";

                // Gets all needed variables for the damage calculation
                const criticalHit = Math.random() < (0.625);
                const criticalMultiplier = criticalHit ? 1.5 : 1;
                const typeEffectiveness = calculateTypeEffectiveness(
                    (move.type as string).toLowerCase() as PokemonType,
                    (currentOpponent.types as string[]).map(type => type.toLowerCase() as PokemonType)
                );
                const stab = currentPlayer.types.includes(move.type) ? 1.5 : 1;
                const random = (Math.floor(Math.random() * (255 - 217 + 1)) + 217) / 255; // Random value between 0.85 and 1.0

                console.log("Damage calculation parameters for Player: ", {
                    level: currentPlayer.lvl,
                    criticalMultiplier,
                    power: move.power,
                    attack: currentPlayer.attack,
                    defense: currentOpponent.defense,
                    specialAttack: currentPlayer.special_attack,
                    specialDefense: currentOpponent.special_defense,
                    stab,
                    typeEffectiveness,
                    random
                });

                // Calculate damage based on the move's damage class
                let damage = 0;
                if (move.damageClass === "Physical") {
                    damage = Math.floor(
                        ((((2 * currentPlayer.lvl * criticalMultiplier / 5) + 2) * move.power * (currentPlayer.attack / currentOpponent.defense) / 50) + 2) * stab * typeEffectiveness * random
                    );
                } else if (move.damageClass === "Special") {
                    damage = Math.floor(
                        ((((2 * currentPlayer.lvl * criticalMultiplier / 5) + 2) * move.power * (currentPlayer.special_attack / currentOpponent.special_defense) / 50) + 2) * stab * typeEffectiveness * random
                    );
                }
                // Calculate the new HP for the opponent and ensure it doesn't go below 0
                const newHp = Math.max(0, currentOpponent.currentHP - damage);

                // Set the battle text based on the damage parameters
                if (criticalHit) {
                    setBattleText(`${currentPlayer.name} landed a critical hit!`);
                    console.log(`${currentPlayer.name} landed a critical hit!`);
                }
                if (typeEffectiveness > 1) {
                    setBattleText(`${currentPlayer.name}'s move was super effective!`);
                }
                if (typeEffectiveness < 1) {
                    setBattleText(`${currentPlayer.name}'s move was not very effective...`);
                }

                // Reduces the PP of the move used by the player
                setPlayerTeam((prevTeam) =>
                    prevTeam.map((p, i) => {
                        if (i === activePlayerIndex && p.id === currentPlayer.id) {
                            const updated = p.clone();
                            updated.setCurrentPP(move.name, Math.max(0, updated.getCurrentPP(move.name) - 1));
                            console.log(`PP reduced for ${p.name} move ${move.name}`);
                            return updated;
                        }
                        return p;
                    })
                );

                // If the move is not a status move, update the opponent's HP
                if (!isStatusMove) {
                    setOpponentTeam((prevTeam) =>
                        prevTeam.map((p, i) => {
                            if (i === activeOpponentIndex && p.id === currentOpponent.id) {
                                const updated = p.clone();
                                updated.setCurrentHP(newHp);
                                console.log(`Opponent ${p.name} HP reduced to ${newHp}`);
                                return updated;
                            }
                            return p;
                        })
                    );
                }

                await delay(1000);

                // If the opponent's HP reaches 0, handle the fainting logic
                if (!isStatusMove && newHp === 0) {
                    setBattleText(`${currentOpponent.name} fainted!`);
                    console.log(`${currentOpponent.name} fainted!`);

                    //Select a new Pokémon for the opponent
                    const availablePokemon = opponentTeam.filter(
                        (p) => p.currentHP > 0 && p.id !== currentOpponent.id
                    );

                    await delay(1000);

                    // Switch to a new Pokémon if available
                    if (availablePokemon.length > 0) {
                        const nextPokemon = availablePokemon[Math.floor(Math.random() * availablePokemon.length)];
                        setBattleText("Opponent is switching Pokémon...");
                        console.log("Opponent switching Pokemon...");

                        await delay(1000);

                        await processSwitchOpponent(nextPokemon);

                        setIsAnimating(false);
                        setIsPlayerTurn(true);
                    } else {
                        // If no Pokémon left, player wins
                        setBattleText("You win! Opponent has no Pokémon left!");
                        console.log("Player wins, no opponent left");
                        setIsAnimating(false);
                    }
                } else {
                    if (!isStatusMove) {
                        // If the move is not a status move, update the battle text with damage dealt
                        setBattleText(`${currentOpponent.name} took ${damage} damage!`);
                        console.log(`${currentOpponent.name} took ${damage} damage`);
                    }

                    await delay(1000);

                    setIsPlayerTurn(false);
                    setIsAnimating(false);
                    console.log("Switching to opponent's turn");
                    // If it's the first move, start the opponent's turn
                    if (first) {
                        console.log("First move, starting opponent's turn");
                        setPendingAction({ type: "opponentMove" });
                        firstRef.current = false;
                    } else {
                        // If it's not the first move, reset the pending action
                        setPendingAction(null);
                        firstRef.current = true;
                    }
                }
            };

            // Processes the opponent's move
            const processEnemyMove = async (P_move?: Moves) => {
                console.log("Processing enemy move");

                const first = firstRef.current;
                // Current Pokémon from both teams
                const currentOpponent = opponentTeam[activeOpponentIndex];
                const currentPlayer = playerTeam[activePlayerIndex];

                // Filter the opponent's moveset to find available moves
                const availableMoves = currentOpponent.moveset.filter(
                    (move) => currentOpponent.getCurrentPP(move.name) > 0
                );

                // If no moves are available, the opponent cannot attack
                if (availableMoves.length === 0) {
                    setBattleText(`${currentOpponent.name} has no moves left!`);
                    console.log(`${currentOpponent.name} has no moves left!`);
                    setIsPlayerTurn(true);
                    setIsAnimating(false);
                    setPendingAction(null);
                    return;
                }

                // Randomly select a move from the available moves
                const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
                setBattleText(`${currentOpponent.name} used ${randomMove.name}!`);
                console.log(`${currentOpponent.name} used ${randomMove.name}`);
                setIsAnimating(true);
                await delay(1000);

                const isStatusMove = randomMove.damageClass === "Status";

                // Gets all needed variables for the damage calculation
                const criticalHit = Math.random() < (0.625);
                const criticalMultiplier = criticalHit ? 1.5 : 1;
                const typeEffectiveness = calculateTypeEffectiveness(
                    (randomMove.type as string).toLowerCase() as PokemonType,
                    (currentPlayer.types as string[]).map(type => type.toLowerCase() as PokemonType)
                );
                const stab = currentPlayer.types.includes(randomMove.type) ? 1.5 : 1;
                const random = (Math.floor(Math.random() * (255 - 217 + 1)) + 217) / 255; // Random value between 0.85 and 1.0

                console.log("Damage calculation parameters for Opponent: ", {
                    level: currentOpponent.lvl,
                    criticalMultiplier,
                    power: randomMove.power,
                    attack: currentOpponent.attack,
                    defense: currentPlayer.defense,
                    specialAttack: currentOpponent.special_attack,
                    specialDefense: currentPlayer.special_defense,
                    stab,
                    typeEffectiveness,
                    random
                });

                // Calculate damage based on the move's damage class
                let damage = 0;
                if (randomMove.damageClass === "Physical") {
                    damage = Math.floor(
                        ((((2 * currentOpponent.lvl * criticalMultiplier / 5) + 2) * randomMove.power * (currentOpponent.attack / currentPlayer.defense) / 50) + 2) * stab * typeEffectiveness * random
                    );
                }
                else if (randomMove.damageClass === "Special") {
                    damage = Math.floor(
                        ((((2 * currentOpponent.lvl * criticalMultiplier / 5) + 2) * randomMove.power * (currentOpponent.special_attack / currentPlayer.special_defense) / 50) + 2) * stab * typeEffectiveness * random
                    );
                }

                // Set the battle text based on the damage parameters
                if (criticalHit) {
                    setBattleText(`${currentOpponent.name} landed a critical hit!`);
                    console.log(`${currentOpponent.name} landed a critical hit!`);
                }
                if (typeEffectiveness > 1) {
                    setBattleText(`${currentOpponent.name}'s move was super effective!`);
                }
                if (typeEffectiveness < 1) {
                    setBattleText(`${currentOpponent.name}'s move was not very effective...`);
                }

                // Calculate the new HP for the player and ensure it doesn't go below 0
                const newHp = Math.max(0, currentPlayer.currentHP - damage);

                // Reduces the PP of the move used by the opponent
                setOpponentTeam((prevTeam) =>
                    prevTeam.map((p, i) => {
                        if (i === activeOpponentIndex && p.id === currentOpponent.id) {
                            const updated = p.clone();
                            updated.setCurrentPP(randomMove.name, Math.max(0, updated.getCurrentPP(randomMove.name) - 1));
                            console.log(`PP reduced for opponent ${p.name} move ${randomMove.name}`);
                            return updated;
                        }
                        return p;
                    })
                );

                // If the move is not a status move, update the player's HP
                if (!isStatusMove) {
                    setPlayerTeam((prevTeam) =>
                        prevTeam.map((p, i) => {
                            if (i === activePlayerIndex && p.id === currentPlayer.id) {
                                const updated = p.clone();
                                updated.setCurrentHP(newHp);
                                console.log(`Player ${p.name} HP reduced to ${newHp}`);
                                return updated;
                            }
                            return p;
                        })
                    );
                }

                await delay(1000);

                // If the player's HP reaches 0, handle the fainting logic
                if (!isStatusMove && newHp === 0) {
                    setBattleText(`${currentPlayer.name} fainted!`);
                    console.log(`${currentPlayer.name} fainted!`);

                    const availablePokemon = playerTeam.filter(
                        (p) => p.currentHP > 0 && p.id !== currentPlayer.id
                    );

                    await delay(1500);

                    // If the player has available Pokémon, prompt to switch
                    if (availablePokemon.length > 0) {
                        setBattleText("Please select a new Pokemon.");
                        setCurrentMenu("pokemon");
                        setIsAnimating(false);
                        console.log("Player must switch Pokemon");
                    } else {
                        // If no Pokémon left, player loses
                        setBattleText("All your Pokémon have fainted! You lose!");
                        setIsAnimating(false);
                        console.log("Player lost, no Pokemon left");
                    }
                    setPendingAction(null);
                } else {
                    // If the move is not a status move, update the battle text with damage dealt
                    if (!isStatusMove) {
                        setBattleText(`${currentPlayer.name} took ${damage} damage!`);
                        console.log(`${currentPlayer.name} took ${damage} damage`);
                    }
                    setIsPlayerTurn(true);
                    setIsAnimating(false);
                    console.log("Switching to player's turn");
                    // If it's the first move, start the player's turn
                    if (first) {
                        setPendingAction({ type: "playerMove", move: P_move || randomMove });
                        firstRef.current = false;
                    } else {
                        // If it's not the first move, reset the pending action
                        setPendingAction(null);
                        firstRef.current = true;
                    }
                }
            };

            const processSwitchPokemon = async (newPokemon: Pokemon_in_battle) => {

                // Get the current player Pokémon and check if the new Pokémon is valid for switching
                const currentPlayer = playerTeam[activePlayerIndex];

                console.log("Switching Pokémon:", newPokemon.name);
                if (!newPokemon || newPokemon.id === currentPlayer.id || newPokemon.currentHP <= 0) {
                    setPendingAction(null);
                    return;
                }

                // Rendering the switching animation
                setIsSwitchingPlayer(true);
                setSwitchingOutPlayer(currentPlayer);
                setSwitchingInPlayer(newPokemon);
                setSwitchDirectionPlayer("out");

                setBattleText(`Come back, ${currentPlayer.name}!`);

                await delay(1000);

                setSwitchDirectionPlayer("in");
                setBattleText(`Go, ${newPokemon.name}!`);

                await delay(1000);

                // Update the active player index to the new Pokémon
                const newIndex = playerTeam.findIndex((p) => p.id === newPokemon.id);
                if (newIndex !== -1) {
                    setActivePlayerIndex(newIndex);
                    setIsSwitchingPlayer(false);
                    setSwitchingOutPlayer(null);
                    setSwitchingInPlayer(null);
                    setCurrentMenu("main");
                }

                // Update the battle text to prompt the opponent's next action
                if (isPlayerTurn && newPokemon.currentHP > 0) {
                    setIsPlayerTurn(false);
                    await delay(1000);
                    setPendingAction({ type: "opponentMove" }); // Start the opponent's turn
                } else {
                    setBattleText(`What will ${newPokemon.name} do?`);
                }
            }

            // Processes the opponent's switch Pokémon action
            const processSwitchOpponent = async (newPokemon: Pokemon_in_battle) => {

                // Get the current opponent Pokémon and check if the new Pokémon is valid for switching
                const currentOpponent = opponentTeam[activeOpponentIndex];
                const playerPokemon = playerTeam[activePlayerIndex];

                console.log("Switching opponent Pokémon:", newPokemon.name);
                // If the new Pokémon is invalid (same as current, or fainted), do nothing
                if (!newPokemon || newPokemon.id === currentOpponent.id || newPokemon.currentHP <= 0) {
                    setPendingAction(null);
                    return;
                }

                // Render the switching animation
                setIsSwitchingOpponent(true);
                setSwitchingOutOpponent(currentOpponent);
                setSwitchingInOpponent(newPokemon);
                setSwitchDirectionOpponent("out");

                setBattleText(`Opponent withdraws ${currentOpponent.name}!`);

                await delay(1000);

                setSwitchDirectionOpponent("in");
                setBattleText(`Opponent sends out ${newPokemon.name}!`);

                await delay(1000);

                // Update the active opponent index to the new Pokémon
                const newIndex = opponentTeam.findIndex((p) => p.id === newPokemon.id);
                if (newIndex !== -1) {
                    setActiveOpponentIndex(newIndex);
                    setIsSwitchingOpponent(false);
                    setSwitchingOutOpponent(null);
                    setSwitchingInOpponent(null);
                    setBattleText(`What will ${playerPokemon.name} do?`);
                    setCurrentMenu("main");
                }
            }

            // Processes a forced switch, typically after a Pokémon on the Players Turn faints
            const processForcedSwitch = async (newPokemon: Pokemon_in_battle) => {
                // Get the current player Pokémon and check if the new Pokémon is valid for switching
                const currentPlayer = playerTeam[activePlayerIndex];
                console.log("Forced switch to Pokémon:", newPokemon.name);

                if (!newPokemon || newPokemon.id === currentPlayer.id || newPokemon.currentHP <= 0) {
                    setPendingAction(null);
                    return;
                }

                // Only if the current Pokémon has fainted
                if (currentPlayer.currentHP <= 0) {
                    setBattleText(`${currentPlayer.name} has fainted!`);

                    // Render the switching animation
                    setIsSwitchingPlayer(true);
                    setSwitchingOutPlayer(currentPlayer);
                    setSwitchingInPlayer(newPokemon);
                    setSwitchDirectionPlayer("out");
                    setBattleText(`Come back, ${currentPlayer.name}!`);

                    await delay(1000);

                    setSwitchDirectionPlayer("in");
                    setBattleText(`Go, ${newPokemon.name}!`);

                    await delay(1000);

                    // Update the active player index to the new Pokémon
                    const newIndex = playerTeam.findIndex((p) => p.id === newPokemon.id);
                    if (newIndex !== -1) {
                        setActivePlayerIndex(newIndex);
                        setIsSwitchingPlayer(false);
                        setSwitchingOutPlayer(null);
                        setSwitchingInPlayer(null);
                        setCurrentMenu("main");
                        setBattleText(`What will ${newPokemon.name} do?`);
                        setIsPlayerTurn(true);
                        setIsAnimating(false);
                    }
                }
            }
            // Process the pending action based on the set pendingAction Type
            if (pendingAction.type === "playerMove") {
                await processPlayerMove(pendingAction.move)
            } else if (pendingAction.type === "opponentMove") {
                await processEnemyMove(pendingAction.move);
            } else if (pendingAction.type === "switchPokemon") {
                await processSwitchPokemon(pendingAction.newPokemon);
            } else if (pendingAction.type === "switchOpponent") {
                await processSwitchOpponent(pendingAction.newPokemon);
            } else if (pendingAction.type === "ForcedSwitch") {
                await processForcedSwitch(pendingAction.newPokemon);
            }
            setPendingAction(null);
        })();
    }, [pendingAction]);


    // Handles the player's move selection and updates the battle state accordingly
    const handlePlayerMove = (move: Moves) => {
        if (!isPlayerTurn || isAnimating) return
        console.log("Player's turn to move:", move.name);
        setPendingAction({ type: "playerMove", move })
        setIsAnimating(true)
        setCurrentMenu("main")
        setBattleText(`${playerPokemon.name} used ${move.name}!`)
    }

    // Handles the opponent's move selection and updates the battle state accordingly
    const handleOpponentMove = () => {
        if (isAnimating) return;
        console.log("Opponent's turn to move");
        setPendingAction({ type: "opponentMove" })
        setIsAnimating(true)
        setCurrentMenu("main")
    }

    // Handles the menu selection and updates the current menu state
    const handleMenuSelect = (menu: MenuOption) => {
        if (menu === "items") {
            setBattleText("Your bag is empty!")
            return
        }

        if (menu === "run" || (menu === "main" && currentMenu === "main")) {
            setShowRunConfirmation(true)
            setBattleText("Are you sure you want to give up?")
            return
        }

        setCurrentMenu(menu)
        if (menu === "main") {
            setBattleText("What will " + playerPokemon.name + " do?")
        }
    }

    // Handles the run action confirmation
    const handleRunConfirm = () => {
        setBattleText("You ran away from the battle!")
        setShowRunConfirmation(false)
        onEndofBattle()
    }

    // Handles the run action cancellation
    const handleRunCancel = () => {
        setShowRunConfirmation(false)
        setBattleText("What will " + playerPokemon.name + " do?")
    }

    // Handles the Pokémon selection from the player's team when switching Pokémon is forced
    const handlePokemonSelect = (pokemon: Pokemon_in_battle) => {
        // Dead Pokémon cannot be selected
        if (pokemon.currentHP <= 0) return;

        const currentPlayer = playerTeam[activePlayerIndex];

        // If the current Pokémon is still alive and the same one is selected, cancel
        if (currentPlayer.currentHP > 0 && pokemon.id === currentPlayer.id) return;

        // If the current Pokémon is fainted, a forced switch occurs (e.g., after fainting)
        if (currentPlayer.currentHP === 0) {
            setPendingAction({ type: "ForcedSwitch", newPokemon: pokemon });
        } else {
            // Normal switch through Pokemon menu
            switchPlayerPokemon(pokemon);
        }
    };

    // Handles the Player's Pokémon switch action through the Pokémon menu
    const switchPlayerPokemon = (newPokemon: Pokemon_in_battle) => {
        if (isAnimating || !isPlayerTurn) return
        console.log("Switching player Pokémon:", newPokemon.name);
        setPendingAction({ type: "switchPokemon", newPokemon })
        setCurrentMenu("main")
    }

    // Handles the Opponent's Pokémon switch action through the Pokémon menu
    const switchOpponentPokemon = (newPokemon: Pokemon_in_battle) => {
        if (isAnimating || isPlayerTurn) return
        console.log("Switching opponent Pokémon:", newPokemon.name);
        setPendingAction({ type: "switchOpponent", newPokemon })
        setCurrentMenu("main")
    }

    // Returns the color class for a Pokémon type
    const getTypeColor = (type: string): string => {
        const colors: { [key: string]: string } = {
            Normal: "bg-gray-400 text-black",
            Fire: "bg-red-500 text-white",
            Water: "bg-blue-500 text-white",
            Electric: "bg-yellow-400 text-black",
            Grass: "bg-green-500 text-white",
            Ice: "bg-blue-300 text-black",
            Fighting: "bg-red-700 text-white",
            Poison: "bg-purple-500 text-white",
            Ground: "bg-yellow-700 text-black",
            Flying: "bg-indigo-400 text-white",
            Psychic: "bg-pink-400 text-white",
            Bug: "bg-lime-500 text-black",
            Rock: "bg-yellow-600 text-white",
            Ghost: "bg-purple-700 text-white",
            Dragon: "bg-purple-600 text-white",
            Dark: "bg-gray-800 text-white",
            Steel: "bg-gray-600 text-white",
            Fairy: "bg-pink-300 text-black",
        }

        return colors[type] || "bg-gray-500 text-white"
    }

    // Returns the color class for the HP bar based on current and max HP
    const getHPColor = (currentHP: number, maxHP: number): string => {
        const percentage = (currentHP / maxHP) * 100
        if (percentage > 50) return "bg-green-500"
        if (percentage > 25) return "bg-yellow-500"
        return "bg-red-500"
    }

    // Returns the icon for a Pokémon type
    const getTypeIcon = (type: string): JSX.Element => {
        const iconMap: { [key: string]: JSX.Element } = {
            Normal: <Circle className="w-4 h-4" />,
            Fire: <Flame className="w-4 h-4" />,
            Water: <Droplet className="w-4 h-4" />,
            Electric: <Zap className="w-4 h-4" />,
            Grass: <Leaf className="w-4 h-4" />,
            Ice: <Snowflake className="w-4 h-4" />,
            Fighting: <Swords className="w-4 h-4" />,
            Poison: <Skull className="w-4 h-4" />,
            Ground: <Globe className="w-4 h-4" />,
            Flying: <Bird className="w-4 h-4" />,
            Psychic: <Eye className="w-4 h-4" />,
            Bug: <Bug className="w-4 h-4" />,
            Rock: <Mountain className="w-4 h-4" />,
            Ghost: <Ghost className="w-4 h-4" />,
            Dragon: <Mountain className="w-4 h-4" />,
            Dark: <Moon className="w-4 h-4" />,
            Steel: <Shield className="w-4 h-4" />,
            Fairy: <Sparkles className="w-4 h-4" />,
            Stellar: <Star className="w-4 h-4" />,
        }

        return iconMap[type] || <HelpCircle className="w-4 h-4" />
    }

    // Sets the currently displayed Opponent Pokémon based on the switching state
    const displayedOpponent = isSwitchingOpponent
        ? switchDirectionOpponent === "in"
            ? switchingInOpponent
            : switchingOutOpponent
        : opponentTeam[activeOpponentIndex];

    // Sets depending on if the opponent is switching out a dead Pokémon
    const isOpponentFainting = isSwitchingOpponent && switchDirectionOpponent === "out";

    // Forces the displayed HP to 0 if the opponent is fainting
    const displayedCurrentHP = isOpponentFainting ? 0 : displayedOpponent?.currentHP ?? 0;
    const displayedMaxHP = displayedOpponent?.maxHP ?? 1;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto px-2 py-4">
                <div className="max-w-3xl mx-auto relative">
                    {/* Opponent Team Status - Top Left */}
                    <div className="absolute top-4 left-4 z-10">
                        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg">
                            <CardContent className="p-2">
                                <div className="text-xs text-muted-foreground mb-1">Opponent</div>
                                <div className="flex gap-1">
                                    {/* Display for each Member on opponents team a Pokeball
                                        and greys out when the representative Pokémon fainted */}
                                    {opponentTeam.map((pokemon, index) => (
                                        <SimplePokeballIcon
                                            key={index}
                                            size={16}
                                            className={`transition-all duration-300 ${pokemon.currentHP > 0
                                                ? "text-red-500 hover:scale-110"
                                                : "text-gray-400 dark:text-gray-600 opacity-50"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Battle Arena */}
                    <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm mb-3">
                        <CardContent className="p-0">
                            <div
                                className="relative min-h-[350px] rounded-t-lg overflow-hidden bg-cover bg-center bg-no-repeat"
                                style={{
                                    // Set the background image for the battlefield
                                    backgroundImage: `url(${battlefieldImage})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                {/* Overlay for better readability */}
                                <div className="absolute inset-0 bg-black/10"></div>

                                {/* Opponent Pokemon */}
                                <div className="relative z-10 flex justify-end pt-6 pr-6 mb-6">
                                    <div className="flex items-center gap-3">
                                        {/* Animate the opponent's Pokémon switching in and out as well as attacking
                                            if none of those Rendering Variables are active it will only show the pokemon sprite */}
                                        <AnimatePresence mode="wait">
                                            {isSwitchingOpponent &&
                                                switchingOutOpponent?.id === displayedOpponent?.id &&
                                                switchDirectionOpponent === "out" ? (
                                                <motion.div
                                                    key="opponent-out"
                                                    initial={{ opacity: 1, y: 0 }}
                                                    animate={{ opacity: 0, y: -50 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="mt-8"
                                                >
                                                    <img
                                                        src={displayedOpponent?.sprite || "/placeholder.svg"}
                                                        alt={displayedOpponent?.name}
                                                        className="w-32 h-32 object-contain drop-shadow-2xl"
                                                    />
                                                </motion.div>
                                            ) : isSwitchingOpponent &&
                                                switchDirectionOpponent === "in" &&
                                                switchingInOpponent?.id === displayedOpponent?.id ? (
                                                <motion.div
                                                    key="opponent-in"
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 1 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="mt-8"
                                                >
                                                    <img
                                                        src={displayedOpponent?.sprite || "/placeholder.svg"}
                                                        alt={displayedOpponent?.name}
                                                        className="w-32 h-32 object-contain drop-shadow-2xl"
                                                    />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="opponent-normal"
                                                    initial={{ opacity: 1 }}
                                                    animate={{
                                                        y: isAnimating && !isPlayerTurn ? [0, -10, 0] : 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.5,
                                                        repeat: isAnimating && !isPlayerTurn ? 1 : 0,
                                                    }}
                                                    className="mt-8"
                                                >
                                                    <img
                                                        src={displayedOpponent?.sprite || "/placeholder.svg"}
                                                        alt={displayedOpponent?.name}
                                                        className="w-32 h-32 object-contain drop-shadow-2xl"
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Display the opponent's Pokémon card with HP and types */}
                                        <Card className="mb-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-lg">
                                            <CardContent className="p-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div>
                                                        {/* Display the opponent's Pokémon name, level, and types */}
                                                        <div className="font-bold text-base">{displayedOpponent?.name}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            Lv.{displayedOpponent?.lvl}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {displayedOpponent?.types.map((type) => (
                                                            <Badge
                                                                key={type}
                                                                className={`${getTypeColor(type)} text-white border-0 shadow-md`}
                                                            >
                                                                {type}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="w-40">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        {/* Display the opponent's HP with current and max HP */}
                                                        <span>HP</span>
                                                        <span>
                                                            {displayedCurrentHP}/{displayedMaxHP}
                                                        </span>
                                                    </div>
                                                    <Progress
                                                        value={
                                                            ((displayedCurrentHP) / (displayedMaxHP)) * 100
                                                        }
                                                        className="h-2 shadow-sm"
                                                        indicatorClassName={getHPColor(
                                                            displayedOpponent?.currentHP ?? 0,
                                                            displayedOpponent?.maxHP ?? 1
                                                        )}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>

                                {/* Player Pokemon */}
                                <div className="relative z-10 flex justify-start pl-6 pb-6">
                                    <div className="flex items-center gap-3">
                                        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-lg">
                                            <CardContent className="p-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="flex gap-2">
                                                        {/* Display the player's Pokémon types as badges */}
                                                        {playerPokemon.types.map((type) => (
                                                            <Badge key={type} className={`${getTypeColor(type)} text-white border-0 shadow-md`}>
                                                                {type}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <div>
                                                        {/* Display the player's Pokémon name and level */}
                                                        <div className="font-bold text-base">{playerPokemon.name}</div>
                                                        <div className="text-xs text-muted-foreground">Lv.{playerPokemon.lvl}</div>
                                                    </div>
                                                </div>
                                                <div className="w-40">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        {/* Display the player's Pokémon HP with current and max HP */}
                                                        <span>HP</span>
                                                        <span>
                                                            {playerPokemon.currentHP}/{playerPokemon.maxHP}
                                                        </span>
                                                    </div>
                                                    <Progress
                                                        value={(playerPokemon.currentHP / playerPokemon.maxHP) * 100}
                                                        className="h-2 shadow-sm"
                                                        indicatorClassName={getHPColor(playerPokemon.currentHP, playerPokemon.maxHP)}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                        {/* Animate the player's Pokémon switching in and out as well as attacking
                                            if none of those Rendering Variables are active it will only show the pokemon sprite */}
                                        <AnimatePresence mode="wait">
                                            {isSwitchingPlayer && switchingOutPlayer?.id === playerPokemon.id && switchDirectionPlayer === "out" ? (
                                                <motion.div
                                                    key="player-out"
                                                    initial={{ opacity: 1, y: 0 }}
                                                    animate={{ opacity: 0, y: 50 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    <img
                                                        src={playerPokemon.sprite_back || "/placeholder.svg"}
                                                        alt={playerPokemon.name}
                                                        className="w-32 h-32 object-contain drop-shadow-2xl"
                                                    />
                                                </motion.div>
                                            ) : isSwitchingPlayer &&
                                                switchingInPlayer &&
                                                switchDirectionPlayer === "in" &&
                                                switchingOutPlayer?.id === playerPokemon.id ? (
                                                <motion.div
                                                    key="player-in"
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 1 }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    <img
                                                        src={switchingInPlayer.sprite_back || "/placeholder.svg"}
                                                        alt={switchingInPlayer.name}
                                                        className="w-32 h-32 object-contain drop-shadow-2xl"
                                                    />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="player-normal"
                                                    initial={{ opacity: 1 }}
                                                    animate={{
                                                        y: isAnimating && isPlayerTurn ? [0, -10, 0] : 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.5,
                                                        repeat: isAnimating && isPlayerTurn ? 1 : 0,
                                                    }}
                                                >
                                                    <img
                                                        src={playerPokemon.sprite_back || "/placeholder.svg"}
                                                        alt={playerPokemon.name}
                                                        className="w-32 h-32 object-contain drop-shadow-2xl"
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Battle Interface with Team Status */}
                    <div className="relative">
                        {/* Player Team Status - Right Side */}
                        <div className="absolute -right-20 top-4 z-10">
                            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg">
                                <CardContent className="p-2">
                                    <div className="text-xs text-muted-foreground mb-1 text-center">Your Team</div>
                                    <div className="flex flex-col gap-1">
                                        {/* Display for each Member on player's team a Pokeball
                                            that greys out when the representativ Pokemon fainted */}
                                        {playerTeam.map((pokemon, index) => (
                                            <span
                                                key={index}
                                                onClick={() => {
                                                }}
                                                className="inline-block"
                                                style={{ cursor: pokemon.currentHP > 0 && pokemon.id !== playerPokemon.id ? "pointer" : "default" }}
                                            >
                                                <SimplePokeballIcon
                                                    size={18}
                                                    className={`transition-all duration-300 ${pokemon.currentHP > 0
                                                        ? pokemon.id === playerPokemon.id
                                                            ? "text-green-500 scale-110"
                                                            : "text-red-500 hover:scale-110 cursor-pointer"
                                                        : "text-gray-400 dark:text-gray-600 opacity-50"
                                                        }`}
                                                />
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="shadow-xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                            <CardContent className="p-4">
                                {/* Battle Text */}
                                <Card className="bg-slate-100/80 dark:bg-slate-700/80 backdrop-blur-sm border-0 shadow-sm mb-4">
                                    <CardContent className="py-2 px-3">
                                        {/* Display the battle text, which updates based on the current action */}
                                        <p className="text-base font-medium min-h-[24px]">{battleText}</p>
                                    </CardContent>
                                </Card>

                                {/* Main Menu */}
                                {isPlayerTurn &&
                                    !isAnimating &&
                                    !isSwitchingPlayer &&
                                    playerPokemon.currentHP > 0 &&
                                    opponentPokemon.currentHP > 0 &&
                                    currentMenu === "main" && (
                                        <div className="grid grid-cols-2 gap-3">
                                            { /* Main menu with options for attack, Pokémon, items, and run */}
                                            <Button
                                                onClick={() => handleMenuSelect("attack")}
                                                variant="outline"
                                                className="h-14 text-left flex items-center justify-start gap-3 hover:bg-blue-50/80 dark:hover:bg-slate-700/80 border-slate-200 dark:border-slate-600 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200"
                                            >
                                                <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 shadow-sm">
                                                    <Swords className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="font-semibold text-base">Attack</span>
                                            </Button>

                                            <Button
                                                onClick={() => handleMenuSelect("pokemon")}
                                                variant="outline"
                                                className="h-14 text-left flex items-center justify-start gap-3 hover:bg-blue-50/80 dark:hover:bg-slate-700/80 border-slate-200 dark:border-slate-600 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200"
                                            >
                                                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 shadow-sm">
                                                    <User2 className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="font-semibold text-base">Pokémon</span>
                                            </Button>

                                            <Button
                                                onClick={() => handleMenuSelect("items")}
                                                variant="outline"
                                                className="h-14 text-left flex items-center justify-start gap-3 hover:bg-blue-50/80 dark:hover:bg-slate-700/80 border-slate-200 dark:border-slate-600 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200"
                                            >
                                                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 shadow-sm">
                                                    <Package className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="font-semibold text-base">Items</span>
                                            </Button>

                                            <Button
                                                onClick={() => handleMenuSelect("run")}
                                                variant="outline"
                                                className="h-14 text-left flex items-center justify-start gap-3 hover:bg-blue-50/80 dark:hover:bg-slate-700/80 border-slate-200 dark:border-slate-600 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200"
                                            >
                                                <div className="p-2 rounded-lg bg-gradient-to-r from-gray-500 to-slate-600 shadow-sm">
                                                    <LogOut className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="font-semibold text-base">Run</span>
                                            </Button>
                                        </div>
                                    )}

                                {/* Attack Menu */}
                                {isPlayerTurn &&
                                    !isAnimating &&
                                    !isSwitchingPlayer &&
                                    playerPokemon.currentHP > 0 &&
                                    opponentPokemon.currentHP > 0 &&
                                    currentMenu === "attack" && (
                                        <>
                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                {/* Display the player's Pokémon moves with type icons and PP as well as Power */}
                                                {playerPokemon.moveset.map((move, index) => {
                                                    const iconElement = getTypeIcon(move.type)
                                                    const currentPP = playerPokemon.getCurrentPP(move.name)
                                                    const isDisabled = currentPP <= 0

                                                    return (
                                                        <Button
                                                            key={index}
                                                            onClick={() => !isDisabled && handlePlayerMove(move)}
                                                            variant="outline"
                                                            disabled={isDisabled}
                                                            className={`h-14 text-left flex items-center justify-start gap-3 
                                                                ${isDisabled
                                                                    ? "opacity-50 cursor-not-allowed"
                                                                    : "hover:bg-blue-50/80 dark:hover:bg-slate-700/80"
                                                                } 
                                                                border-slate-200 dark:border-slate-600 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200`}
                                                        >
                                                            <div className={`p-2 rounded-lg ${getTypeColor(move.type)} shadow-sm`}>
                                                                {iconElement}
                                                            </div>
                                                            <div className="flex flex-col items-start">
                                                                <span className="font-semibold text-sm">{move.name}</span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {move.power > 0 ? `${move.power} Power` : "Status"} • {move.type} • {move.damageClass} • {currentPP}/{move.pp}
                                                                </span>
                                                            </div>
                                                        </Button>
                                                    )
                                                })}
                                            </div>
                                            {/* Back button to return to the main menu */}
                                            <Button
                                                onClick={() => setCurrentMenu("main")}
                                                variant="outline"
                                                className="w-full text-sm h-8 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                                            >
                                                Back
                                            </Button>
                                        </>
                                    )}

                                {/* Pokemon Menu */}
                                {!isSwitchingPlayer && opponentPokemon.currentHP > 0 && currentMenu === "pokemon" && (
                                    <>
                                        {/* Display the player's Pokémon team with selectable options
                                            Already Fainted Pokemon are displayed greyed out
                                            The currently selected Pokemon is greened out */}
                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            {playerTeam.map((pokemon, index) => {
                                                const isSelectable =
                                                    pokemon.currentHP > 0 &&
                                                    (playerPokemon.currentHP === 0 || pokemon.id !== playerPokemon.id);

                                                return (
                                                    // Display each Pokémon in the team with the sprite on top of a Pokeball
                                                    // If the Pokémon is selectable, it can be clicked to switch and the image scales up on hover
                                                    <motion.div
                                                        key={index}
                                                        whileHover={isSelectable ? { scale: 1.05 } : {}}
                                                        onClick={() => isSelectable && handlePokemonSelect(pokemon)}
                                                        className={`flex flex-col items-center justify-center p-3 rounded-lg shadow-md transition-all duration-200 ${pokemon.currentHP === 0
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : pokemon.id === playerPokemon.id
                                                                ? "bg-green-100/80 dark:bg-green-900/30 border border-green-300 dark:border-green-700"
                                                                : "cursor-pointer bg-white/80 dark:bg-slate-800/80 hover:bg-blue-50/80 dark:hover:bg-blue-900/20"
                                                            }`}
                                                    >
                                                        <div className="relative w-20 h-20">
                                                            <SimplePokeballIcon
                                                                size={80}
                                                                className={pokemon.id === playerPokemon.id ? "text-green-500" : "text-red-500"}
                                                            />
                                                            <img
                                                                src={pokemon.sprite || "/placeholder.svg"}
                                                                alt={pokemon.name}
                                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 object-contain"
                                                            />
                                                        </div>
                                                        {/* Display the Pokémon's name and HP bar */}
                                                        <span className="text-sm font-medium mt-2">{pokemon.name}</span>
                                                        <div className="w-full mt-1">
                                                            <Progress
                                                                value={(pokemon.currentHP / pokemon.maxHP) * 100}
                                                                className={`h-1.5 ${(pokemon.currentHP / pokemon.maxHP) > 0.5
                                                                    ? "bg-green-200 dark:bg-green-800"
                                                                    : pokemon.currentHP / pokemon.maxHP > 0.25
                                                                        ? "bg-yellow-200 dark:bg-yellow-800"
                                                                        : "bg-red-200 dark:bg-red-800"
                                                                    }`}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-muted-foreground mt-1">
                                                            {pokemon.currentHP}/{pokemon.maxHP} HP
                                                        </span>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                        {/* Back button to return to the main menu */}
                                        <Button
                                            onClick={() => {
                                                if (playerPokemon.currentHP > 0) {
                                                    setCurrentMenu("main")
                                                }
                                            }}
                                            variant="outline"
                                            className="w-full text-sm h-8 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                                            disabled={playerPokemon.currentHP === 0}
                                        >
                                            {playerPokemon.currentHP === 0 ? "Choose a Pokémon" : "Back"}
                                        </Button>
                                    </>
                                )}

                                {/* Run Confirmation Menu */}
                                {/* Display Menu to make sure that the player wants to run away */}
                                {isPlayerTurn &&
                                    !isAnimating &&
                                    !isSwitchingPlayer &&
                                    playerPokemon.currentHP > 0 &&
                                    opponentPokemon.currentHP > 0 &&
                                    showRunConfirmation && (
                                        <div className="space-y-4">
                                            <div className="text-center">
                                                <p className="text-lg font-semibold mb-4">Are you sure you want to give up?</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                { /* Buttons to confirm or cancel the run action
                                                     Confirmation ends the battle while cancellation returns to the main menu */
                                                }

                                                <Button
                                                    onClick={handleRunConfirm}
                                                    variant="outline"
                                                    className="h-14 text-center flex items-center justify-center gap-3 hover:bg-red-50/80 dark:hover:bg-red-900/20 border-red-200 dark:border-red-600 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200"
                                                >
                                                    <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 shadow-sm">
                                                        <LogOut className="h-4 w-4 text-white" />
                                                    </div>
                                                    <span className="font-semibold text-base text-red-600 dark:text-red-400">Yes, give up</span>
                                                </Button>
                                                <Button
                                                    onClick={handleRunCancel}
                                                    variant="outline"
                                                    className="h-14 text-center flex items-center justify-center gap-3 hover:bg-green-50/80 dark:hover:bg-green-900/20 border-green-200 dark:border-green-600 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200"
                                                >
                                                    <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-sm">
                                                        <Shield className="h-4 w-4 text-white" />
                                                    </div>
                                                    <span className="font-semibold text-base text-green-600 dark:text-green-400">
                                                        No, keep fighting
                                                    </span>
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                {/* Waiting State */}
                                {/* Display a waiting state when it's not the player's turn or when an animation is in progress */}
                                {(!isPlayerTurn || isAnimating || isSwitchingPlayer) &&
                                    playerPokemon.currentHP > 0 &&
                                    opponentPokemon.currentHP > 0 &&
                                    !showRunConfirmation &&
                                    currentMenu !== "pokemon" && (
                                        <div className="text-center py-6">
                                            <div className="inline-flex items-center gap-2 text-muted-foreground">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-75"></div>
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                                                <span className="ml-2">
                                                    {isSwitchingPlayer
                                                        ? "Switching Pokémon..."
                                                        : isAnimating
                                                            ? "Battle in progress..."
                                                            : "Opponent's turn..."}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                {/* Game Over State */}
                                {/* Display a button to return to the teambuilder if either team has no Pokémon left */}
                                {(playerTeam.every((p) => p.currentHP === 0) || opponentTeam.every((p) => p.currentHP === 0)) && (
                                    <div className="text-center">
                                        <Button
                                            onClick={() => onEndofBattle()}
                                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2 text-base"
                                        >
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            Back to Teambuilder
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div >
    )
}