import { TextField, Alert, AlertColor } from '@mui/material';
import React, { useEffect, useState } from 'react'

export function Reception() {
	const [ID, setID] = useState("");

	const [displayAlert, setDisplayAlert] = useState<boolean>(false);
	const [alertSeverity, setAlertSeverity] = useState<AlertColor>();
	const [alertMessage, setAlertMessage] = useState<string>();

	const onKeyDown = (e: any) => {
		if (e.keyCode === 13) {
			console.log("kaage");
			onSubmit();
		}
	};

	const onSubmit = async () => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ guest_id: ID })
		};

		await fetch(`${process.env.REACT_APP_BACKEND_URL}/reception`, requestOptions)
			.then(response => {
				if (response.ok) {
					setDisplayAlert(true), setAlertSeverity("success"), setAlertMessage("入場を受け付けました。");
				}
				else if (response.status == 400) {
					setDisplayAlert(true), setAlertSeverity("error"), setAlertMessage("サーバーが理解できないリクエストが送信されました。入力事項を確認してください。");
				}
				else if (response.status == 500) {
					setDisplayAlert(true), setAlertSeverity("error"), setAlertMessage("サーバーエラーです。しばらく経ってからもう一度お試しください。");
				}
				else if (response.status == 404) {
					setDisplayAlert(true), setAlertSeverity("error"), setAlertMessage("存在しないか使用済み、キャンセル済みの ID です。");
				}
				else {
					setDisplayAlert(true), setAlertSeverity("error"), setAlertMessage("未知のエラーが発生しました。しばらく経ってからもう一度お試しください。");
				}
			})

		setID("")
	};

	return (
		<>
			<TextField value={ID} onChange={e => setID(e.target.value)} onSubmit={onSubmit} onKeyDown={onKeyDown}></TextField>
			{
				displayAlert ? <Alert severity={alertSeverity}>{alertMessage}</Alert> : <></>
			}
		</>
	);
}
