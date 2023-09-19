import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import { Button, Paper, Typography, Alert, AlertColor } from '@mui/material'
import { InputBox, SelectBox } from './QuestionBox'
import { SubmitHandler, useForm } from 'react-hook-form'
import "../css/Form.css"

interface RegisterInput {
	guest_name: string,
	email: string,
	phone: string,
	time_id: Number,
	gender: Number,
	age: Number,
	guest_type: Number,
	student_grade?: Number | string,
	student_class?: Number | string,
	student_number?: Number | string,
	student_name?: string
};

interface RegisterProps {
	checked: boolean
}

interface RegisterCompProps {
	checked: boolean
}

export function Register(props: RegisterProps) {
	const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>();
	const navigation = useNavigate();
	const captchaRef: React.LegacyRef<ReCAPTCHA> = useRef(null);
	const [availableTimeId, setAvailableTimeId] = useState<boolean[]>();
	const [displayAlert, setDisplayAlert] = useState<boolean>(false);
	const [alertSeverity, setAlertSeverity] = useState<AlertColor>();
	const [alertMessage, setAlertMessage] = useState<string>();

	useEffect(() => {
		if (captchaRef.current) {
			console.log("kaage");
			const head = document.getElementsByTagName("head")[0];
			const script = document.createElement("script");
			script.async = true;
			script.type = "text/javascript";
			script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.REACT_APP_RECAPTCHA_SITE_KEY || ""}`;
			head.appendChild(script);
		}
		(async () => {
			await fetch(`${process.env.REACT_APP_BACKEND_URL}/check_available`)
				.then(response => response.json())
				.then(responseJson => setAvailableTimeId(responseJson))
		})();
	}, [])

	const onSubmit: SubmitHandler<RegisterInput> = async (data: RegisterInput) => {
		if (captchaRef.current != null) {
			if (data.student_grade == "") delete data.student_grade;
			if (data.student_class == "") delete data.student_class;
			if (data.student_number == "") delete data.student_number;
			if (data.student_name == "") delete data.student_name;
			console.log(data);
			const token = await captchaRef.current.getValue();
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...data, recaptcha_token: token })
			};
			console.log(requestOptions);

			await fetch(`${process.env.REACT_APP_BACKEND_URL}/register`, requestOptions)
				.then(response => {
					if (response.ok) return response.json();
					else if (response.status == 400) {
						setDisplayAlert(true), setAlertSeverity("error"), setAlertMessage("サーバーが理解できないリクエストが送信されました。入力事項を確認してください。");
					}
					else if (response.status == 500) {
						setDisplayAlert(true), setAlertSeverity("error"), setAlertMessage("サーバーエラーです。しばらく経ってからもう一度お試しください。");
					}
					else {
						setDisplayAlert(true), setAlertSeverity("error"), setAlertMessage("未知のエラーが発生しました。しばらく経ってからもう一度お試しください。");
					}
				})
				.then(responseJson => {
					alert("次の画面で、入場パスと申込 ID が表示されます。必ず入場パスをスクリーンショットなどで保存するか、申込 ID をメモしてからページを閉じてください。");
					navigation(`/showqr`, {
						state: { id: responseJson.guest_id, name: data.guest_name, time: data.time_id, student_name: data.student_name }
					});
				})
				.catch(error => {
					setDisplayAlert(true), setAlertSeverity("error"), setAlertMessage("リクエストの送信中にエラーが発生しました。しばらく経ってからもう一度お試しください。");
					console.error(error);
				})

		}
	};

	const time_candidates = ["10/28(金) 9:30~", "10/28(金) 10:00~", "10/28(金) 10:30~", "10/28(金) 11:00~",
		"10/29(土) 9:30~", "10/29(土) 10:00~", "10/29(土) 10:30~", "10/29(土) 11:00~",
		"10/30(日) 9:30~", "10/30(日) 10:00~", "10/30(日) 10:30~", "10/30(日) 11:00~"];
	const gender_candidates = ["男性", "女性", "回答しない"];
	const age_candidates = ["未就学児", "小学生", "中学生", "10 代（上記以外）", "20 代", "30 代", "40 代", "50 代", "60 代以上"];
	const guest_type_candidates = ["生徒家族", "OB", "一般"];
	const student_grade_candidates = ["中 1", "中 2", "中 3", "高 1", "高 2", "高 3"];
	const student_class_candidates = ["A", "B", "C", "D", "1", "2", "3", "4"];
	const student_number_candidates = [...Array(42)].map((_, i) => (i + 1).toString());

	return (
		<Paper className="form-paper" elevation={3}>
			<div className="form-box">
				<InputBox label="氏名" id="guest_name" register={register} required={true} error={"guest_name" in errors} />
				<InputBox label="メールアドレス" id="email" register={register} required={true} pattern={/[\w\-._]+@[\w\-._]+\.[A-Za-z]+/} error={"email" in errors} errorMessage={"半角で正しいメールアドレスを入力してください"} />
				<InputBox label="電話番号" id="phone" register={register} required={true} pattern={/[0-9\-]+/} error={"phone" in errors} errorMessage="半角数字とハイフンのみで入力してください" />
				<SelectBox label="希望の優先入場時間" id="time_id" register={register} candidates={time_candidates} required={true} error={"time_id" in errors} available={props.checked ? availableTimeId : Array(12).fill(true)} require_available={true} />
				<Typography>以下のアンケートにもお答えください。今後の文化祭運営に活用させていただきます。</Typography>
				<SelectBox label="性別" id="gender" register={register} candidates={gender_candidates} required={true} error={"gender" in errors} />
				<SelectBox label="年齢" id="age" register={register} candidates={age_candidates} required={true} error={"age" in errors} />
				<SelectBox label="種別" id="guest_type" register={register} candidates={guest_type_candidates} required={true} error={"guest_type" in errors} />
				<Typography>生徒家族の方は、以下から生徒の情報を選択してください。兄弟がいる場合は、どちらの情報でも構いません。</Typography>
				<SelectBox className="student-info" label="学年" id="student_grade" register={register} candidates={student_grade_candidates} required={false} />
				<SelectBox className="student-info" label="クラス" id="student_class" register={register} candidates={student_class_candidates} required={false} />
				<SelectBox className="student-info" label="番号" id="student_number" register={register} candidates={student_number_candidates} required={false} />
				<InputBox className="student-info" label="生徒氏名" id="student_name" register={register} required={false} />
				<div className="send-button">
					<ReCAPTCHA sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || ""} ref={captchaRef} />
					<Button variant="contained" onClick={handleSubmit(onSubmit)}>送信</Button>
				</div>
				{
					displayAlert ? <Alert severity={alertSeverity}>{alertMessage}</Alert> : <></>
				}
			</div>
		</Paper >
	);
}

export function RegisterComp(props: RegisterCompProps) {
	return (
		<div className="form">
			<Paper id="whole-paper" elevation={3}>
				<p>2022 年度筑駒文化祭の入場予約フォームです。今年の文化祭は 10/28 (金) から 10/30 (日) の 3 日間開催し、1 日あたり上限を4000名としております。</p>
				<p>入場待機列の混雑緩和のため、開場の 9:30 から 30 分ごとに、1000 名ずつの枠を 4 つ設け、
					各枠の時間帯においては優先的に入場できるものとします。なお、ご予約された優先入場時間枠より早く入場することはできません。
					また、ご予約された優先入場時間帯を過ぎた場合は優先的に入場することはできず、最後尾に並んでいただきます。
					ただし、どの時間帯に入場しても、閉場時間まで校内に滞在可能です。</p>
				<p>各日・時間帯ごとに、上限人数に達し次第、申込受付を締め切らせていただきます。</p>
				<p>このフォームに関するお問い合わせは、すべて筑駒文化祭実行委員会 tkbunkasai(atmark)gmail.com までお願いします。（(atmark) を '@' で置き換えてください。）</p>
				<p>直接本校にご連絡されても対応できませんのでご了承ください。</p>
				<span className="to-right"><p>筑波大学附属駒場中・高等学校　第 71 回文化祭実行委員会</p></span>
				<Typography align="left" variant="h5">⚠️注意事項</Typography>
				<p>・複数日にわたって予約しても構いません。その場合は、複数回この予約フォームからご予約ください。</p>
				<p>・優先入場時間帯を過ぎてご来場された場合は、ご来場された時間帯の枠の最後尾にお並びいただいて入場することができます。同一の方が同じ日に複数枠お申込みされるのはお止め下さい。</p>
				<p>・予約者と異なる方が来場することはできません。本人確認をする場合がありますので、身分証（学生証、運転免許証など）となるものをお持ちください。</p>
				<p>・3 歳以下のお子様は申込不要です。</p>
				<p>・本人がメールアドレスや電話番号を持っていない場合は、保護者等の代理人のものを使って構いません。</p>
				<p>・送信ボタンを押すと、次の画面で入場パスが表示されます。画面のスクリーンショットを保存するか、画面を印刷していただくようお願いします。</p>
				<p>・申込 ID は、予約の確認や予約後のキャンセルを行う際に必要になります。予約完了確認メールは送信されませんので、画面をとじてしまうと申込 ID はご確認できなくなります。画面をとじる前に、必ず申込 ID をメモしていただくようお願いいたします。</p>
				<p>・予約後のキャンセルは、<Link to="/unregister">キャンセル用ページ</Link>から承ります。予約枠は限られていますので、来られない場合にはキャンセルへのご協力をお願いします。</p>
			</Paper>
			<Register checked={props.checked} />
		</div>
	)
};