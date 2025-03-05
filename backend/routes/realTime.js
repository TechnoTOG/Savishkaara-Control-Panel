const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

module.exports = function (io) {
    router.post('send-update', async (req, res) => {
        const { room } = req.body;
    
        if(!room){
            if(room === 'samridhi'){
                // Room update logic

                io.to(room).emit("update", data);
                console.log({
                    event: 'update_emitted',
                    room,
                    data,
                    timestamp: new Date().toISOString(),
                });

                return res.status(200).send({message: "Update Success!"});
            }else if(room === 'server'){
                // Room update logic

                io.to(room).emit("update", data);
                console.log({
                    event: 'update_emitted',
                    room,
                    data,
                    timestamp: new Date().toISOString(),
                });

                return res.status(200).send({message: "Update Success!"});
            }else if(room === 'eventso'){
                // Room update logic

                io.to(room).emit("update", data);
                console.log({
                    event: 'update_emitted',
                    room,
                    data,
                    timestamp: new Date().toISOString(),
                });

                return res.status(200).send({message: "Update Success!"});
            }else if(room === 'eventsa'){
                // Room update logic

                io.to(room).emit("update", data);
                console.log({
                    event: 'update_emitted',
                    room,
                    data,
                    timestamp: new Date().toISOString(),
                });

                return res.status(200).send({message: "Update Success!"});
            }else if(room === 'userso'){
                // Room update logic

                io.to(room).emit("update", data);
                console.log({
                    event: 'update_emitted',
                    room,
                    data,
                    timestamp: new Date().toISOString(),
                });

                return res.status(200).send({message: "Update Success!"});
            }else if(room === 'usersa'){
                // Room update logic

                io.to(room).emit("update", data);
                console.log({
                    event: 'update_emitted',
                    room,
                    data,
                    timestamp: new Date().toISOString(),
                });

                return res.status(200).send({message: "Update Success!"});
            }else if(room === 'vevents'){
                // Room update logic

                io.to(room).emit("update", data);
                console.log({
                    event: 'update_emitted',
                    room,
                    data,
                    timestamp: new Date().toISOString(),
                });

                return res.status(200).send({message: "Update Success!"});
            }else if(room === 'myevent'){
                // Room update logic

                io.to(room).emit("update", data);
                console.log({
                    event: 'update_emitted',
                    room,
                    data,
                    timestamp: new Date().toISOString(),
                });

                return res.status(200).send({message: "Update Success!"});
            }
        }else{
            return res.status(400).send({message: "Incomplete Update request!!"});
        }
    });
};