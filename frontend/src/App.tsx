import {useEffect, useState} from 'react'
import './App.css'
import type {UserDetails} from "./components/model/UserDetailsModel.ts";
import type {RealEstateModel} from "./components/model/RealEstateModel.ts";
import axios from "axios";
import Navbar from "./components/Navbar.tsx";
import {Route, Routes} from "react-router-dom";
import Welcome from "./components/Welcome.tsx";
import NotFound from "./components/NotFound.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Profile from "./components/Profile.tsx";
import Footer from "./components/Footer.tsx";
import Items from "./components/Items.tsx";
import MapBoxAll from "./components/MapBoxAll.tsx";

export default function App() {
    const [user, setUser] = useState<string>("anonymousUser");
    const [role, setRole] = useState<string>("anonymousRole");
    const displayRole = user === "anonymousUser" ? "anonymousRole" : role;
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [language, setLanguage] = useState<string>("de");
    const [favorites, setFavorites] = useState<string[]>([]);
    const [realEstates, setRealEstates] = useState<RealEstateModel[]>([]);


    function getUser() {
        axios.get("/api/users/me")
            .then((response) => {
                setUser(response.data.toString());
            })
            .catch((error) => {
                console.error(error);
                setUser("anonymousUser");
            });
    }

    function getUserDetails() {
        axios.get("/api/users/me/details")
            .then((response) => {
                setUserDetails(response.data as UserDetails);
            })
            .catch((error) => {
                console.error(error);
                setUserDetails(null);
            });
    }

    function getUserRoles() {
        axios.get("/api/users/me/role")
            .then((response) => {
                setRole(response.data.toString());
            })
            .catch((error) => {
                console.error(error);
                setRole("anonymousRole");
            });
    }

    useEffect(() => {
        getUser();
        getAllRealEstates();
    }, []);

    useEffect(() => {
        if(user !== "anonymousUser") {
            getUserDetails();
            getUserRoles();
            getAppUserFavorites();
        }
    }, [user]);

    function getAppUserFavorites(){
        axios.get<RealEstateModel[]>(`/api/users/favorites`)
            .then((response) => {
                const favoriteIds = response.data.map((realEstate) => realEstate.id);
                setFavorites(favoriteIds);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function getAllRealEstates() {
        axios.get<RealEstateModel[]>(`/api/immo-calc-hub`)
            .then((response) => {
                setRealEstates(response.data);
            })
            .catch((error) => {
                console.error("Error fetching real estates:", error);
            });
    }

    function toggleFavorite(realEstateId: string) {
        const isFavorite = favorites.includes(realEstateId);

        if (isFavorite) {
            axios.delete(`/api/users/favorites/${realEstateId}`)
                .then(() => {
                    setFavorites((prevFavorites) =>
                        prevFavorites.filter((id) => id !== realEstateId)
                    );
                })
                .catch((error) => console.error(error));
        } else {
            axios.post(`/api/users/favorites/${realEstateId}`)
                .then(() => {
                    setFavorites((prevFavorites) => [...prevFavorites, realEstateId]);
                })
                .catch((error) => console.error(error));
        }
    }


  return (
    <>
        <Navbar user={user} getUser={getUser} getUserDetails={getUserDetails} language={language} setLanguage={setLanguage}/>
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Welcome role={displayRole}/>}/>
            <Route path="/items" element={<Items />}/>
            <Route path="/mapbox-all" element={<MapBoxAll favorites={favorites} realEstates={realEstates} toggleFavorite={toggleFavorite} />} />
            <Route element={<ProtectedRoute user={user}/>}>
                <Route path="/profile/*" element={<Profile user={user} userDetails={userDetails} language={language}/>} />
            </Route>
        </Routes>
        <Footer/>
    </>
  )
}
