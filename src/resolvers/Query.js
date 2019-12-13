const Query = {
    
    getPartidos: async (parent, args, ctx, info) => {

        const { client } = ctx;
        const db = client.db("La_Liga_123Pez");
        const collection = db.collection("Match");

        const result = await collection.find({}).toArray();
        return result;
    },
    getEquipos: async (parent, args, ctx, info) => {

        const { client } = ctx;
        const db = client.db("La_Liga_123Pez");
        const collection = db.collection("Team");
  
    
        const result = await collection.find({}).toArray();
        return result;
    },
}

export {Query as default}