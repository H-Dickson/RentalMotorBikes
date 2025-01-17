import React from 'react';
import Header from "../components/header/header"
import Cities from "../components/cities/cities"
import Info from "../components/info/info"
import Bikes from '../components/bikes/bikes';
import About from '../components/about/about';

const HomePage = () =>{
    return (
        <div>
            <Header />
            <Cities />
            <Info />
            <Bikes />
            <About />
        </div>
    );
}

export default HomePage;