import React from 'react'
import Telecity from '../asset/Telecity_Transparent.png'
import Card from '../components/Card';
import { useNavigate } from "react-router-dom";

const AboutUsNew = () => {

    const navigate = useNavigate();

    const handleCardClick = (path) => {
        navigate(path);
    };

    return (
        <div className="p-8 bg-slate-100">
            <div className="mb-8">
                <h1 className="mb-4 text-pretty text-3xl font-bold text-left">About Us</h1>
                <p className="mb-6 text-left mt-4 text-pretty">
                    3 Sectors under Telecity Trading which was founded in 2006
                </p>
            </div>
            <div className="grid grid-cols-1 gap-y-12">
                <div className="flex justify-center items-center">
                    <img src={Telecity} alt="Center" className="h-64 w-auto" />
                </div>
                <div className="grid grid-cols-1 gap-y-12"></div> {/* Empty row */}
                <div className="grid grid-cols-1 gap-y-12"></div> {/* Empty row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex justify-center items-center">
                        <Card title="HOCO YGN & MDY" onClick={() => handleCardClick('/hoco')} />
                    </div>
                    <div className="flex justify-center items-center">
                        <Card title="Naing Win Telecom" onClick={() => handleCardClick('/telecom')} />
                    </div>
                    <div className="flex justify-center items-center">
                        <Card title="Naing Win Service" onClick={() => handleCardClick('/service')} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutUsNew