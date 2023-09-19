import React, { useState } from 'react'
import { Button, Paper, Alert, AlertColor } from '@mui/material'
import { InputBox } from './QuestionBox'
import { SubmitHandler, useForm } from 'react-hook-form'
import "../css/Form.css"

interface UnregisterInput {
	guest_id: string,
	phone: string
}

export function Unregister() {
	const { register, handleSubmit, formState: { errors } } = useForm<UnregisterInput>();
	const [displayAlert, setDisplayAlert] = useState<boolean>(false);
	const [alertSeverity, setAlertSeverity] = useState<AlertColor>();
	const [alertMessage, setAlertMessage] = useState<string>();

	const onSubmit: SubmitHandler<UnregisterInput> = async (data: UnregisterInput) => {
		console.log(data);
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		};
		console.log(requestOptions);

		await fetch(`${process.env.REACT_APP_BACKEND_URL}/unregister`, requestOptions)
			.then(response => {
				if (response.ok) {
					setDisplayAlert(true), setAlertSeverity("success"), setAlertMessage("キャンセルに成功しました。");
				}
				else if (response.status == 400) {
					setDisplayAlert(true), setAlertSeverity("error"), setAlertMessage("サーバーが理解できないリクエストが送信されました。入力事項を確認してください。");
				}
				else if (response.status == 404) {
					setDisplayAlert(true), setAlertSeverity("error"), setAlertMessage("既にキャンセル済みであるか、ID か電話番号が間違っています。");
				}
				else if (response.status == 500) {
					setDisplayAlert(true), setAlertSeverity("error"), setAlertMessage("サーバーエラーです。しばらく経ってからもう一度お試しください。");
				}
				else {
					setDisplayAlert(true), setAlertSeverity("error"), setAlertMessage("未知のエラーが発生しました。しばらく経ってからもう一度お試しください。");
				}
			})
			.catch(error => console.error(error))
	};

	return (
		<Paper className="form-paper">
			<div className="form-box">
				<InputBox label="申込 ID" id="guest_id" register={register} required={true} error={"guest_id" in errors} />
				<InputBox label="申込時の電話番号" id="phone" register={register} required={true} pattern={/[0-9\-]+/} error={"phone" in errors} errorMessage="半角数字とハイフンのみで入力してください" />
				<div className="send-button">
					<Button variant="contained" onClick={handleSubmit(onSubmit)}>送信</Button>
				</div>
				{
					displayAlert ? <Alert severity={alertSeverity}>{alertMessage}</Alert> : <></>
				}
			</div>
		</Paper>
	)
}

export function UnregisterComp() {
	return (
		<div className="form">
			<p>以下に ID と申込時の電話番号を入力すると、登録のキャンセルができます。入場枠は限られているため、来られなくなった場合は必ずキャンセルするようにしてください。</p>
			<p>円滑な文化祭の運営にご協力お願いします。</p>
			<hr />
			<Unregister />
		</div>
	)
}