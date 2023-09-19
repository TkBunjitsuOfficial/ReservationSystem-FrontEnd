import React from 'react'
import { Paper, Typography, Button } from '@mui/material'
import { Header } from './components/Header'
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'
import { RegisterComp } from './components/Register'
import { UnregisterComp } from './components/Unregister'
import { CheckComp } from './components/Check'
import { ShowQR } from './components/ShowQR'
import { NightStage } from './components/NightStage'
import { Reception } from './components/Reception'
import './App.css'

const NavigationBanner = () => {
	const navigation = useNavigate();
	return (
		<>
			<Button className="banner" variant="contained" color="warning" onClick={() => { navigation("/unregister"); }}>キャンセルはこちら</Button>
			<Button className="banner" variant="contained" color="success" onClick={() => { navigation("/check"); }}>入場パスの確認はこちら</Button>
		</>
	)
}

export default function App() {
	return (
		<div className="App">
			<Header />
			<Routes>
				<Route path="/" element={<NavigationBanner />} />
				<Route path="/special_reservation" element={<NavigationBanner />} />
				<Route path="/*" element={<></>} />
			</Routes>
			<div className="main">
				<Routes>
					<Route path="/" element={<RegisterComp checked={true} />} />
					<Route path="/special_reservation" element={<RegisterComp checked={false} />} />
					<Route path="/showqr" element={<ShowQR />} />
					<Route path="/unregister" element={<UnregisterComp />} />
					<Route path="/check" element={<CheckComp />} />
					<Route path="/keion_nightstage" element={<NightStage />} />
					<Route path="/reception" element={<Reception />} />
				</Routes>
			</div>
		</div>
	);
}