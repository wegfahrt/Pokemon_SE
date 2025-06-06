"use client"

import { useEffect, useState, type JSX } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    Zap, Shield, RotateCcw,
    Swords, Package, User2, LogOut, Bird, Bug, Circle,
    Droplet, Eye, Flame, Ghost, Globe, HelpCircle, Leaf,
    Moon, Skull, Snowflake, Sparkles, Mountain,
    Star
} from "lucide-react"
import { SimplePokeballIcon } from "@/components/ui/pokeball-icon"
import type { Pokemon, Pokemon_in_battle, Moves } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"
import React from "react"

type MenuOption = "main" | "attack" | "pokemon" | "items" | "run"

export default function pokemon_battle({
    FullUserteam,
    FullEnemyTeam,
}: { FullUserteam: Pokemon[]; FullEnemyTeam: Pokemon[] }) {

    // Battle-ready Teams nur einmal erzeugen (Memo)
    const initialUserTeam = React.useMemo(
        () => FullUserteam.map((p) => p.makeBattleReady()),
        [FullUserteam]
    )
    const initialEnemyTeam = React.useMemo(
        () => FullEnemyTeam.map((p) => p.makeBattleReady()),
        [FullEnemyTeam]
    )

    // Team States
    const [playerTeam, setPlayerTeam] = useState<Pokemon_in_battle[]>(initialUserTeam)
    const [opponentTeam, setOpponentTeam] = useState<Pokemon_in_battle[]>(initialEnemyTeam)

    // Aktive Pokémon Indizes
    const [activePlayerIndex, setActivePlayerIndex] = useState(0)
    const [activeOpponentIndex, setActiveOpponentIndex] = useState(0)

    // Aktive Pokémon aus den aktuellen Teams ziehen
    const playerPokemon = playerTeam[activePlayerIndex]
    const opponentPokemon = opponentTeam[activeOpponentIndex]

    // Battle Text initial mit aktuellem Spieler-Pokemon
    const [battleText, setBattleText] = useState(() => `What will ${playerPokemon.name} do?`)

    const [isPlayerTurn, setIsPlayerTurn] = useState(true)
    const [isAnimating, setIsAnimating] = useState(false)
    const [currentMenu, setCurrentMenu] = useState<MenuOption>("main")
    const [showRunConfirmation, setShowRunConfirmation] = useState(false)

    // Animation States
    const [isSwitchingPokemon, setIsSwitchingPokemon] = useState(false)
    const [switchingIn, setSwitchingIn] = useState<Pokemon_in_battle | null>(null)
    const [switchingOut, setSwitchingOut] = useState<Pokemon_in_battle | null>(null)
    const [switchDirection, setSwitchDirection] = useState<"in" | "out">("out")


    type PendingAction = null |
    { type: "playerMove"; move: Moves } |
    { type: "opponentMove" } |
    { type: "switchPokemon"; newPokemon: Pokemon_in_battle } |
    { type: "switchOpponent"; newPokemon: Pokemon_in_battle } |
    { type: "ForcedSwitch"; newPokemon: Pokemon_in_battle }

    const [pendingAction, setPendingAction] = useState<PendingAction>(null)
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    useEffect(() => {
        console.log("Player Pokemon updated:", playerPokemon);
    }, [playerPokemon]);

    useEffect(() => {
        console.log("Opponent Pokemon updated:", opponentPokemon);
    }, [opponentPokemon]);

    useEffect(() => {
        if (!pendingAction) return;

        const processPlayerMove = async (move: Moves) => {
            console.log("Processing player move:", move.name);

            const currentOpponent = opponentTeam[activeOpponentIndex];
            const currentPlayer = playerTeam[activePlayerIndex];
            const isStatusMove = move.damageClass === "Status";
            const damage = isStatusMove ? 0 : Math.floor(move.power / 2);
            const newHp = Math.max(0, currentOpponent.currentHP - damage);

            // PP reduzieren
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

            // Schaden
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

            if (!isStatusMove && newHp === 0) {
                setBattleText(`${currentOpponent.name} fainted!`);
                console.log(`${currentOpponent.name} fainted!`);

                const availablePokemon = opponentTeam.filter(
                    (p) => p.currentHP > 0 && p.id !== currentOpponent.id
                );

                await delay(1000);

                if (availablePokemon.length > 0) {
                    const nextPokemon = availablePokemon[Math.floor(Math.random() * availablePokemon.length)];
                    setBattleText("Opponent is switching Pokémon...");
                    console.log("Opponent switching Pokemon...");

                    await delay(1000);

                    setBattleText(`Opponent sends out ${nextPokemon.name}!`);
                    setActiveOpponentIndex(opponentTeam.findIndex((p) => p.id === nextPokemon.id));
                    console.log(`Opponent sent out ${nextPokemon.name}`);

                    await delay(1000);

                    setIsAnimating(false);
                    setIsPlayerTurn(true);
                    setCurrentMenu("main");
                } else {
                    setBattleText("You win! Opponent has no Pokémon left!");
                    console.log("Player wins, no opponent left");
                    setIsAnimating(false);
                }
            } else {
                if (!isStatusMove) {
                    setBattleText(`${currentOpponent.name} took ${damage} damage!`);
                    console.log(`${currentOpponent.name} took ${damage} damage`);
                }

                await delay(1000);

                setIsPlayerTurn(false);
                setIsAnimating(false);
                setPendingAction({ type: "opponentMove" }); // Gegnerzug starten
            }
        };

        const processEnemyMove = async () => {
            console.log("Processing enemy move");

            const currentOpponent = opponentTeam[activeOpponentIndex];
            const currentPlayer = playerTeam[activePlayerIndex];

            const availableMoves = currentOpponent.moveset.filter(
                (move) => currentOpponent.getCurrentPP(move.name) > 0
            );

            if (availableMoves.length === 0) {
                setBattleText(`${currentOpponent.name} has no moves left!`);
                console.log(`${currentOpponent.name} has no moves left!`);
                setIsPlayerTurn(true);
                setIsAnimating(false);
                setPendingAction(null);
                return;
            }

            const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            setBattleText(`${currentOpponent.name} used ${randomMove.name}!`);
            console.log(`${currentOpponent.name} used ${randomMove.name}`);

            await delay(1000);

            const isStatusMove = randomMove.damageClass === "Status";
            const damage = isStatusMove ? 0 : Math.floor(randomMove.power / 2);
            const newHp = Math.max(0, currentPlayer.currentHP - damage);

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

            if (!isStatusMove && newHp === 0) {
                setBattleText(`${currentPlayer.name} fainted!`);
                console.log(`${currentPlayer.name} fainted!`);

                const availablePokemon = playerTeam.filter(
                    (p) => p.currentHP > 0 && p.id !== currentPlayer.id
                );

                await delay(1500);

                if (availablePokemon.length > 0) {
                    setBattleText("Please select a new Pokemon.");
                    setCurrentMenu("pokemon");
                    setIsAnimating(false);
                    console.log("Player must switch Pokemon");
                } else {
                    setBattleText("All your Pokémon have fainted! You lose!");
                    setIsAnimating(false);
                    console.log("Player lost, no Pokemon left");
                }
                setPendingAction(null);
            } else {
                if (!isStatusMove) {
                    setBattleText(`${currentPlayer.name} took ${damage} damage!`);
                    console.log(`${currentPlayer.name} took ${damage} damage`);
                }
                setIsPlayerTurn(true);
                setIsAnimating(false);
                setPendingAction(null);
            }
        };

        const processSwitchPokemon = async (newPokemon: Pokemon_in_battle) => {

            const currentPlayer = playerTeam[activePlayerIndex];
            console.log("Switching Pokémon:", newPokemon.name);

            if (!newPokemon || newPokemon.id === currentPlayer.id || newPokemon.currentHP <= 0) {
                setPendingAction(null);
                return;
            }
            setIsSwitchingPokemon(true);
            setSwitchingOut(currentPlayer);
            setSwitchingIn(newPokemon);
            setSwitchDirection("out");
            setBattleText(`Come back, ${currentPlayer.name}!`);

            await delay(1000);

            setSwitchDirection("in");
            setBattleText(`Go, ${newPokemon.name}!`);

            await delay(1000);

            const newIndex = playerTeam.findIndex((p) => p.id === newPokemon.id);
            if (newIndex !== -1) {
                setActivePlayerIndex(newIndex);
                setIsSwitchingPokemon(false);
                setSwitchingOut(null);
                setSwitchingIn(null);
                setCurrentMenu("main");
            }

            if (isPlayerTurn && newPokemon.currentHP > 0) {
                setIsPlayerTurn(false);
                await delay(1000);
                setPendingAction({ type: "opponentMove" }); // Gegnerzug starten
            } else {
                setBattleText(`What will ${newPokemon.name} do?`);
            }
        }

        const processSwitchOpponent = async (newPokemon: Pokemon_in_battle) => {

            const currentOpponent = opponentTeam[activeOpponentIndex];
            const playerPokemon = playerTeam[activePlayerIndex];

            console.log("Switching opponent Pokémon:", newPokemon.name);
            if (!newPokemon || newPokemon.id === currentOpponent.id || newPokemon.currentHP <= 0) {
                setPendingAction(null);
                return;
            }

            setIsSwitchingPokemon(true);
            setSwitchingOut(currentOpponent);
            setSwitchingIn(newPokemon);
            setSwitchDirection("out");

            setBattleText(`Opponent withdraws ${currentOpponent.name}!`);

            await delay(1000);

            setSwitchDirection("in");
            setBattleText(`Opponent sends out ${newPokemon.name}!`);

            await delay(1000);

            const newIndex = opponentTeam.findIndex((p) => p.id === newPokemon.id);
            if (newIndex !== -1) {
                setActiveOpponentIndex(newIndex);
                setIsSwitchingPokemon(false);
                setSwitchingOut(null);
                setSwitchingIn(null);
                setCurrentMenu("main");
            }
            setBattleText(`What will ${playerPokemon.name} do?`);

        }

        const processForcedSwitch = async (newPokemon: Pokemon_in_battle) => {
            const currentPlayer = playerTeam[activePlayerIndex];
            console.log("Forced switch to Pokémon:", newPokemon.name);

            if (!newPokemon || newPokemon.id === currentPlayer.id || newPokemon.currentHP <= 0) {
                setPendingAction(null);
                return;
            }

            if (currentPlayer.currentHP <= 0) {
                setBattleText(`${currentPlayer.name} has fainted!`);

                setIsSwitchingPokemon(true);
                setSwitchingOut(currentPlayer);
                setSwitchingIn(newPokemon);
                setSwitchDirection("out");
                setBattleText(`Come back, ${currentPlayer.name}!`);

                await delay(1000);

                setSwitchDirection("in");
                setBattleText(`Go, ${newPokemon.name}!`);

                await delay(1000);

                const newIndex = playerTeam.findIndex((p) => p.id === newPokemon.id);
                if (newIndex !== -1) {
                    setActivePlayerIndex(newIndex);
                    setIsSwitchingPokemon(false);
                    setSwitchingOut(null);
                    setSwitchingIn(null);
                    setCurrentMenu("main");
                    setBattleText(`What will ${newPokemon.name} do?`);
                    setIsPlayerTurn(true);
                    setIsAnimating(false);
                }
            }
        }

        // Verarbeite die Aktion basierend auf dem Typ
        if (pendingAction.type === "playerMove") {
            processPlayerMove(pendingAction.move);
        } else if (pendingAction.type === "opponentMove") {
            processEnemyMove();
        } else if (pendingAction.type === "switchPokemon") {
            processSwitchPokemon(pendingAction.newPokemon);
        } else if (pendingAction.type === "switchOpponent") {
            processSwitchOpponent(pendingAction.newPokemon);
        } else if (pendingAction.type === "ForcedSwitch") {
            processForcedSwitch(pendingAction.newPokemon);
        }
        setPendingAction(null);
    }, [pendingAction]);


    const handlePlayerMove = (move: Moves) => {
        if (!isPlayerTurn || isAnimating) return
        console.log("Player's turn to move:", move.name);
        setPendingAction({ type: "playerMove", move })
        setIsAnimating(true)
        setCurrentMenu("main")
        setBattleText(`${playerPokemon.name} used ${move.name}!`)
    }

    const handleOpponentMove = () => {
        if (isAnimating) return;
        console.log("Opponent's turn to move");
        setPendingAction({ type: "opponentMove" })
        setIsAnimating(true)
        setCurrentMenu("main")
    }

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

    const handleRunConfirm = () => {
        setBattleText("You ran away from the battle!")
        setShowRunConfirmation(false)
        setTimeout(() => {
            return
        }, 2000)
    }

    const handleRunCancel = () => {
        setShowRunConfirmation(false)
        setBattleText("What will " + playerPokemon.name + " do?")
    }

    const handlePokemonSelect = (pokemon: Pokemon_in_battle) => {
        // Totes Pokémon darf nicht ausgewählt werden
        if (pokemon.currentHP <= 0) return;

        const currentPlayer = playerTeam[activePlayerIndex];

        // Wenn aktuelles Pokémon noch lebt und man versucht dasselbe auszuwählen → abbrechen
        if (currentPlayer.currentHP > 0 && pokemon.id === currentPlayer.id) return;

        // Wenn aktuelles Pokémon tot ist → erzwungener Wechsel (z.B. nach K.O.)
        if (currentPlayer.currentHP === 0) {
            setPendingAction({ type: "ForcedSwitch", newPokemon: pokemon });
        } else {
            // Normaler Wechsel durch Menü
            switchPlayerPokemon(pokemon);
        }
    };

    const switchPlayerPokemon = (newPokemon: Pokemon_in_battle) => {
        if (isAnimating || !isPlayerTurn) return
        console.log("Switching player Pokémon:", newPokemon.name);
        setPendingAction({ type: "switchPokemon", newPokemon })
        setCurrentMenu("main")
    }

    const switchOpponentPokemon = (newPokemon: Pokemon_in_battle) => {
        if (isAnimating || !isPlayerTurn) return
        console.log("Switching opponent Pokémon:", newPokemon.name);
        setPendingAction({ type: "switchOpponent", newPokemon })
        setCurrentMenu("main")
    }

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
    const getHPColor = (currentHP: number, maxHP: number): string => {
        const percentage = (currentHP / maxHP) * 100
        if (percentage > 50) return "bg-green-500"
        if (percentage > 25) return "bg-yellow-500"
        return "bg-red-500"
    }
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
                                    backgroundImage: `url('../../public/images/pokemon-battlefield.png')`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                {/* Overlay für bessere Lesbarkeit der UI-Elemente */}
                                <div className="absolute inset-0 bg-black/10"></div>

                                {/* Opponent Pokemon */}
                                <div className="relative z-10 flex justify-end pt-6 pr-6 mb-6">
                                    <div className="flex items-center gap-3">
                                        <AnimatePresence mode="wait">
                                            {isSwitchingPokemon &&
                                                switchingOut?.name === opponentPokemon.name &&
                                                switchDirection === "out" ? (
                                                <motion.div
                                                    key="opponent-out"
                                                    initial={{ opacity: 1, y: 0 }}
                                                    animate={{ opacity: 0, y: -50 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="mt-8"
                                                >
                                                    <img
                                                        src={opponentPokemon.sprite_back || "/placeholder.svg"}
                                                        alt={opponentPokemon.name}
                                                        className="w-32 h-32 object-contain drop-shadow-2xl"
                                                    />
                                                </motion.div>
                                            ) : isSwitchingPokemon &&
                                                switchingIn &&
                                                switchDirection === "in" &&
                                                switchingOut?.name === opponentPokemon.name ? (
                                                <motion.div
                                                    key="opponent-in"
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 1 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="mt-8"
                                                >
                                                    <img
                                                        src={switchingIn.sprite_back || "/placeholder.svg"}
                                                        alt={switchingIn.name}
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
                                                        src={opponentPokemon.sprite_back || "/placeholder.svg"}
                                                        alt={opponentPokemon.name}
                                                        className="w-32 h-32 object-contain drop-shadow-2xl"
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <Card className="mb-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-lg">
                                            <CardContent className="p-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div>
                                                        <div className="font-bold text-base">{opponentPokemon.name}</div>
                                                        <div className="text-xs text-muted-foreground">Lv.{opponentPokemon.lvl}</div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {opponentPokemon.types.map((type) => (
                                                            <Badge key={type} className={`${getTypeColor(type)} text-white border-0 shadow-md`}>
                                                                {type}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="w-40">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span>HP</span>
                                                        <span>
                                                            {opponentPokemon.currentHP}/{opponentPokemon.maxHP}
                                                        </span>
                                                    </div>
                                                    <Progress
                                                        value={(opponentPokemon.currentHP / opponentPokemon.maxHP) * 100}
                                                        className="h-2 shadow-sm"
                                                        indicatorClassName={getHPColor(opponentPokemon.currentHP, opponentPokemon.maxHP)}
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
                                                        {playerPokemon.types.map((type) => (
                                                            <Badge key={type} className={`${getTypeColor(type)} text-white border-0 shadow-md`}>
                                                                {type}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-base">{playerPokemon.name}</div>
                                                        <div className="text-xs text-muted-foreground">Lv.{playerPokemon.lvl}</div>
                                                    </div>
                                                </div>
                                                <div className="w-40">
                                                    <div className="flex justify-between text-xs mb-1">
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
                                        <AnimatePresence mode="wait">
                                            {isSwitchingPokemon && switchingOut?.name === playerPokemon.name && switchDirection === "out" ? (
                                                <motion.div
                                                    key="player-out"
                                                    initial={{ opacity: 1, y: 0 }}
                                                    animate={{ opacity: 0, y: 50 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    <img
                                                        src={playerPokemon.sprite || "/placeholder.svg"}
                                                        alt={playerPokemon.name}
                                                        className="w-32 h-32 object-contain drop-shadow-2xl"
                                                    />
                                                </motion.div>
                                            ) : isSwitchingPokemon &&
                                                switchingIn &&
                                                switchDirection === "in" &&
                                                switchingOut?.name === playerPokemon.name ? (
                                                <motion.div
                                                    key="player-in"
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 1 }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    <img
                                                        src={switchingIn.sprite || "/placeholder.svg"}
                                                        alt={switchingIn.name}
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
                                                        src={playerPokemon.sprite || "/placeholder.svg"}
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
                                        {playerTeam.map((pokemon, index) => (
                                            <span
                                                key={index}
                                                onClick={() => {
                                                    if (
                                                        isPlayerTurn &&
                                                        !isAnimating &&
                                                        pokemon.currentHP > 0 &&
                                                        pokemon.name !== playerPokemon.name
                                                    ) {
                                                        handlePokemonSelect(pokemon)
                                                    }
                                                }}
                                                className="inline-block"
                                                style={{ cursor: pokemon.currentHP > 0 && pokemon.name !== playerPokemon.name ? "pointer" : "default" }}
                                            >
                                                <SimplePokeballIcon
                                                    size={18}
                                                    className={`transition-all duration-300 ${pokemon.currentHP > 0
                                                        ? pokemon.name === playerPokemon.name
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
                                        <p className="text-base font-medium min-h-[24px]">{battleText}</p>
                                    </CardContent>
                                </Card>

                                {/* Main Menu */}
                                {isPlayerTurn &&
                                    !isAnimating &&
                                    !isSwitchingPokemon &&
                                    playerPokemon.currentHP > 0 &&
                                    opponentPokemon.currentHP > 0 &&
                                    currentMenu === "main" && (
                                        <div className="grid grid-cols-2 gap-3">
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
                                    !isSwitchingPokemon &&
                                    playerPokemon.currentHP > 0 &&
                                    opponentPokemon.currentHP > 0 &&
                                    currentMenu === "attack" && (
                                        <>
                                            <div className="grid grid-cols-2 gap-3 mb-3">
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
                                {!isSwitchingPokemon && opponentPokemon.currentHP > 0 && currentMenu === "pokemon" && (
                                    <>
                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            {playerTeam.map((pokemon, index) => {
                                                const isSelectable =
                                                    pokemon.currentHP > 0 &&
                                                    (playerPokemon.currentHP === 0 || pokemon.id !== playerPokemon.id);

                                                return (
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
                                                                src={pokemon.sprite_back || "/placeholder.svg"}
                                                                alt={pokemon.name}
                                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 object-contain"
                                                            />
                                                        </div>
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
                                {isPlayerTurn &&
                                    !isAnimating &&
                                    !isSwitchingPokemon &&
                                    playerPokemon.currentHP > 0 &&
                                    opponentPokemon.currentHP > 0 &&
                                    showRunConfirmation && (
                                        <div className="space-y-4">
                                            <div className="text-center">
                                                <p className="text-lg font-semibold mb-4">Are you sure you want to give up?</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
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
                                {(!isPlayerTurn || isAnimating || isSwitchingPokemon) &&
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
                                                    {isSwitchingPokemon
                                                        ? "Switching Pokémon..."
                                                        : isAnimating
                                                            ? "Battle in progress..."
                                                            : "Opponent's turn..."}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                {/* Game Over State */}
                                {(playerTeam.every((p) => p.currentHP === 0) || opponentTeam.every((p) => p.currentHP === 0)) && (
                                    <div className="text-center">
                                        <Button
                                            onClick={() => window.location.reload()}
                                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2 text-base"
                                        >
                                            <RotateCcw className="h-4 w-4 mr-2" />
                                            Battle Again
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