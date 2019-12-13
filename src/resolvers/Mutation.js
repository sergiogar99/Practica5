import "babel-polyfill";
import { ObjectID } from "mongodb";
import { PubSub } from "graphql-yoga";

const Mutation ={

  addTeam: async (parent, args, ctx, info) => {

    const { name } = args;
    const { client } = ctx;
    const db = client.db("La_Liga_123Pez");
    const collection = db.collection("Team");

    const exist = await collection.findOne({name:name});

    if(!exist){

      const result = await collection.insertOne({name});

      return {
        name,
        _id: result.ops[0]._id
      };
    }

  },
  addMatch: async (parent, args, ctx, info) => {


    const { loc,vis,fecha,resultado,estado } = args;
    const { client,PubSub } = ctx;
    const db = client.db("La_Liga_123Pez");

    //Ver si existen loc y vis
    

    if(loc != vis){

      const collection = db.collection("Team");

      const local = await collection.findOne({ _id: ObjectID(loc)});
      const visitor = await collection.findOne({ _id: ObjectID(vis)});

      if(local && visitor){

        const collection = db.collection("Match");
        const result = await collection.insertOne({loc,vis,fecha,resultado,estado});

        return {

          fecha,
          resultado,
          estado,
          _id: result.ops[0]._id

        };
      }
   }
    
  },
  updateMatch: async (parent, args, ctx, info) => {

          const {_id ,resultado} = args;
          const { client, pubsub } = ctx;

    
          const db = client.db("La_Liga_123Pez");
          let collection = db.collection("Match");

          const exist = await collection.findOne({ _id: ObjectID(_id)});

          if (exist){

            await collection.updateOne({"_id":ObjectID(_id)},{$set:{resultado : resultado}});

            //Actualizaciones
            //-----------------------------------------------------------

            //Actualiza Match

            const match = await collection.findOne({ _id: ObjectID(_id)});

            //pubsub.publish(_id,{tellmatch: match});

            pubsub.publish(
              _id,
              {
                tellmatch: match
              }
            );


            //  // Actualizar Teams
             
             //Obtener id de local y visitante
            const id_local_team = match.loc;
            const id_visitor_team = match.vis;

            //Actualiza Partido

            pubsub.publish(
              id_local_team,
              {
                tellteam: match
              }
            );

            //Actualiza Partido
            
            pubsub.publish(
              id_visitor_team,
              {
                tellteam: match
              }
            );
             
            return match; 

          }else{

            console.log("el partido no existe");

          }
  
  },

}

export {Mutation as default}