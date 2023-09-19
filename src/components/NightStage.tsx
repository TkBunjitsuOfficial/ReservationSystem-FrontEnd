import React, { useEffect } from 'react'

export function NightStage() {
	useEffect(() => {
		setInterval(() => {
			let b = document.getElementsByTagName("body")[0] as HTMLElement;
			b.style.backgroundColor = "white";
			setTimeout(() => {
				b.style.backgroundColor = "black";
			}, 75)
		}, 750)
	}, [])
	return <></>;
}
