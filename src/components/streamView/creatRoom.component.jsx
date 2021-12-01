import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v1 as uuid } from "uuid";
import axios from "axios";
import "./creatRoom.style.css";
import { io } from "socket.io-client";
const socket = io("http://localhost:4000", { transports: ["websocket"] });

const CreateRoom = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    (() => {
      socket.emit("home page refreshed");
      console.log("home page refreshed");
      socket.on("all rooms links", (roomsData) => {
        setRooms(Object.values(roomsData));
      });
    })();
  }, []);
  const create = () => {
    const options = {
      headers: {
        authorization: `bearer ${JSON.parse(
          localStorage.getItem("userAccessToken")
        )}`,
      },
    };
    axios
      .get("http://localhost:4000/auth", options)
      .then((response) => {
        if (response.data.role === "admin") {
          const id = uuid();
          setRooms((perv) => [...rooms, { roomID: id, room: `/room/${id}` }]);
          socket.emit("room created", { roomID: id, roomLink: `/room/${id}` });
          socket.on("all rooms links", (roomsData) => {
            setRooms(Object.values(roomsData));
          });
        }
      });
  };
  const removeRooms = () => {
    socket.emit("remove all rooms");
    socket.on("all rooms links", (roomsData) => {
      setRooms(Object.values(roomsData));
    });
  };
  return (
    <>
      <ul>
        {rooms &&
          rooms.map((roomData, index) => {
            return (
              <li
                key={roomData.roomID}
                className="roomLink"
                onClick={() => navigate(roomData.roomLink)}
              >
                room{index}
              </li>
            );
          })}
      </ul>

      <button onClick={create}>Create room</button>
      <button onClick={removeRooms}>Remove All Rooms</button>
      <button onClick={() => {}}>Log out</button>
    </>
  );
};

export default CreateRoom;
