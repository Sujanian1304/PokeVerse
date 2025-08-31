import express from "express";
import Pokedex from 'pokedex-promise-v2';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from "cors";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const P = new Pokedex();
const app=express();
app.use(express.json());
app.use(cors());
app.get("/cards",async (req,res)=>{
    let pokemontype=req.query.type;
    let number=parseInt(req.query.number,10);
        try{
        const response=await P.getTypeByName(`${pokemontype}`);
        const pokemonList=response.pokemon.slice(0,number);
        const  details=await Promise.all(
            pokemonList.map(async(p)=>{
                const data=await P.getPokemonByName(p.pokemon.name);
                const hp = data.stats.find(stat => stat.stat.name === "hp")?.base_stat;
                const attack = data.stats.find(stat => stat.stat.name === "attack")?.base_stat;
                const defense = data.stats.find(stat => stat.stat.name === "defense")?.base_stat;
                return {
                    name: data.name,
                    id: data.id,
                    image: data.sprites.other["official-artwork"].front_default,
                    hp,
                    attack,
                    defense,
                    height: data.height,
                    weight: data.weight,
                    types: data.types.map(t => t.type.name)
                };
            })
        )
        res.status(200).send(details);
        }catch(error){
            res.status(404).json({message:"there was an error"});
        }
})
app.listen(3002)