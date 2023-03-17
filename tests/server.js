import express from "express";
import path from "path";
import puppeteer from "puppeteer";

export const startTestServer = (script) => async function() {
	const PORT = 8080;

	// set up local server
	this.testApplication = express();
	this.testApplication.use(express.static(path.resolve()));
	express.static.mime.define({"application/javascript": ["js"]});
	this.testApplication.get("/", (request, response) => {
		response.send(
			`<!DOCTYPE html>
			<html lang="en" dir="ltr">
			<head>
				<meta charset="UTF-8">
				<title></title>
			</head>
			<body>
				<script src="../build/pulsar-web.js"></script>
			</body>
			</html>`);
	});
	this.server = this.testApplication.listen(PORT, () => console.log(`Test server started on port ${PORT}...`));

	// launch puppeteer
	this.browser = await puppeteer.launch();
	const pages = await this.browser.pages();
	this.page = pages[0];
	await this.page.goto(`http://localhost:${PORT}`);

	// run setup script for test suite
	await this.page.evaluate(script);

	// wait for everything to settle down
	await new Promise(resolve => setTimeout(() => resolve(), 10));
};
export async function closeTestServer() {
	await this.page.close();
	await this.browser.close();
	this.server.close(() => console.log("Test server closed."));
}
