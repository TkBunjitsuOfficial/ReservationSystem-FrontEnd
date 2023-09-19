import { AppBar, Toolbar } from '@mui/material'
import { Link } from 'react-router-dom'
import React from 'react'

export function Header() {
	return (
		<AppBar position="static" className="appbar">
			<Toolbar>
				<a href="/ReservationSystem" className="header" color="white">
					2022 筑駒文化祭入場予約フォーム特設サイト
				</a>
			</Toolbar>
		</AppBar>
	);
}
