import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Paper, Alert, AlertColor } from '@mui/material'
import { InputBox } from './QuestionBox'
import { SubmitHandler, useForm } from 'react-hook-form'
import "../css/Form.css"

interface CheckInput {
	guest_id: string,
	phone: string
}

export function Check() {
	const { register, handleSubmit, formState: { errors } } = useForm<CheckInput>();
	const [displayAlert, setDisplayAlert] = useState<boolean>(false);
	const [alertSeverity, setAlertSeverity] = useState<AlertColor>();
	const [alertMessage, setAlertMessage] = useState<string>();
	const navigation = useNavigate();

	const onSubmit: SubmitHandler<CheckInput> = async (data: CheckInput) => {
		console.log(data);
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		};
		console.log(requestOptions);

		await fetch(`${process.env.REACT_APP_BACKEND_URL}/check_id`, requestOptions)
			.then(response => {
				if (response.ok) {
					setDisplayAlert(true), setAlertSeverity("success"), setAlertMessage("取得に成功しました。");
					return response.json();
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
			.then(responseJson => navigation(`/showqr`, { state: { id: data.guest_id, name: responseJson.guest_name, time: responseJson.time_id } }))
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

export function CheckComp() {
	return (
		<div className="form">
			<p>以下に ID を入力すると、登録の情報を確認し、入場パスが表示できます。</p>
			<p>円滑な文化祭の運営にご協力お願いします。</p>
			<hr />
			<Check />
		</div>
	)
}