import { Button } from '@mui/material'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import JsBarcode from 'jsbarcode'
import '../css/ShowQR.css'

export function ShowQR() {
	const location = useLocation();
	const [canvas, setCanvas] = useState<HTMLCanvasElement>();
	const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D>();
	const [ticketLoaded, setTicketLoaded] = useState<boolean>(false);
	const template_URLs = ["1A", "1B", "1C", "1D", "2A", "2B", "2C", "2D", "3A", "3B", "3C", "3D"];
	const [id, setId] = useState<string>(location.state.id);
	const [time, setTime] = useState<string>(location.state.time);
	const [name, setName] = useState<string>(location.state.name);

	useEffect(() => {
		console.log("A");
		setCanvas(document.getElementById("ticket") as HTMLCanvasElement);
	}, []);
	useEffect(() => {
		console.log("B");
		if (canvas) {
			canvas.width = 1170, canvas.height = 2532;
			let context = canvas.getContext("2d");
			if (context) {
				setCanvasContext(context);
			}
		}
	}, [canvas]);
	useEffect(() => {
		console.log("C");
		if (canvasContext) {
			const ticket_template = new Image();
			ticket_template.src = "./ticket_templates/D" + template_URLs[parseInt(time || "0")] + ".png";
			ticket_template.onload = () => {
				canvasContext.drawImage(ticket_template, 0, 0, 1170, 2532);
				setTicketLoaded(true);
			}
		}
	}, [canvasContext]);
	useEffect(() => {
		const fontFace = new FontFace('gennokaku-gothic', 'url(/ReservationSystem/SourceHanSansJP-Medium.woff)');
		fontFace.load().then(loadedFace => {
			document.fonts.add(loadedFace);
		}).then(() => {
			if (canvasContext) {
				canvasContext.font = "40pt 'gennokaku-gothic'";
				canvasContext.fillStyle = "#2f3131";
				canvasContext.fillText(id, (1170 - canvasContext.measureText(id).width) / 2, 1617)
				canvasContext.font = "48pt 'gennokaku-gothic'";
				canvasContext.fillText(name || "error", 426, 2080);
				let barcode_canvas = document.createElement("canvas");
				JsBarcode(barcode_canvas, id, { width: 4.54, height: 220, fontSize: 35, textMargin: 30, displayValue: false, margin: 0 });
				console.log(barcode_canvas.width);
				console.log(barcode_canvas.height);
				canvasContext.drawImage(barcode_canvas, 305.5, 1338);
			}
		})
		setTimeout(() => {
			if (canvasContext) {
				canvasContext.font = "40pt 'gennokaku-gothic'";
				canvasContext.fillStyle = "#2f3131";
				canvasContext.fillText(id, (1170 - canvasContext.measureText(id).width) / 2, 1617)
				canvasContext.font = "48pt 'gennokaku-gothic'";
				canvasContext.fillText(name || "error", 426, 2080);
				let barcode_canvas = document.createElement("canvas");
				JsBarcode(barcode_canvas, id, { width: 4.54, height: 220, fontSize: 35, textMargin: 30, displayValue: false, margin: 0 });
				console.log(barcode_canvas.width);
				console.log(barcode_canvas.height);
				canvasContext.drawImage(barcode_canvas, 305.5, 1338);
			}
		}, 3000);
	}, [ticketLoaded]);

	const save = () => {
		if (canvas) {
			const base64 = canvas.toDataURL("image/png");
			const link = document.createElement("a");
			link.download = "入場証.png";
			link.href = base64;
			link.click();
		}
	}

	return (
		<>
			<p>入場予約が完了しました。</p>
			<p>ご入場の際は、以下の入場パスを受付にてご提示ください。この画面のスクリーンショットを保存するか、画面を印刷してお持ちください。</p>
			<p>下に表示されているダウンロードボタンを押すと、入場パスがファイルとしてダウンロードできます。</p>
			<p>入場パスに表示されている申込 ID は、予約の確認や予約後のキャンセルを行う際に必要になります。
				予約完了確認メールは送信されませんので、この画面を移動したり閉じてしまうと、申込 ID はご確認できなくなります。
				画面をとじる前に、必ず入場パスの申込 ID をメモしていただくようお願いいたします。</p>
			<p>ご予約の確認は、確認用ページにて申込 ID を入力すると確認できます。</p>
			<p>予約後のキャンセルは、<Link to="/unregister">キャンセル用ページ</Link>から承ります。予約枠は限られていますので、来られない場合にはキャンセルへのご協力をお願いします。</p>
			<span className="to-right"><p>筑波大学附属駒場中・高等学校　第 71 回文化祭実行委員会</p></span>
			<div className="warning"><h2 style={{ color: "red" }}><span className="warning-span">必ずバーコードの下の申込 ID を</span><span className="warning-span">メモしてから</span><span className="warning-span">このページを閉じる</span><span className="warning-span">ようにしてください。</span></h2></div>
			<div id="ticket-div">
				<Button id="save-button" variant="contained" onClick={save}>入場証をダウンロード</Button>
				<canvas id="ticket" />
			</div>
		</>
	);
}