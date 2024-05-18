const puppeteer = require("puppeteer-core");
const _ = require("lodash/fp");
const username = require("./username");

const sleep = ms => new Promise(res => setTimeout(res, ms));

const initClient = async (
  browser,
  logger,
  joinUrl,
  webcam = false,
  microphone = false
) => {

  const page = await browser.newPage();
  await sleep(3000);
  await page.goto(joinUrl);
  await sleep(3000);
  await page.waitForSelector(`[data-test="microphoneBtn"]`);
  logger.debug(`click on microphoneBtn`);
  if (microphone) {
  await page.click(`[data-test="microphoneBtn"]`);
  } else (
  await page.click(`[data-test="listenOnlyBtn"]`)
  )
  if (microphone) {
    logger.debug("waiting for the echo test dialog");
    try {
      await page.waitForSelector(`[data-test="joinEchoTestButton"]`);
      logger.debug(
        'echo test dialog detected. clicking on "Echo is audible" button.'
      );
      await page.click(`[data-test="joinEchoTestButton"]`);
    } catch (err) {
      logger.debug(
        "unable to detect the echo test dialog. Maybe echo test is disabled."
      );
    }
  }
  //await page.waitForSelector(".ReactModal__Overlay", { hidden: true });
  
  if (microphone) {
    logger.debug("Ensure that we are not muted...");
    // Wait for the toolbar to appear
    await page.waitForSelector('[aria-label="Mute"],[aria-label="Unmute"]');
    // If we are muted, click on Unmute
    const unmuteButton = await page.$('[aria-label="Unmute"]');
    if (unmuteButton !== null) {
      logger.debug("clicking on unmute button");
      await unmuteButton.click();
    }
  }
  if (webcam) {
    await page.waitForSelector('[aria-label="Share webcam"]');
    await page.click('[aria-label="Share webcam"]');
    logger.debug("clicked on sharing webcam");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await page.waitForSelector("#setCam > option");
    await page.waitForSelector('[aria-label="Start sharing"]');
    logger.debug("clicking on start sharing");
    await page.click('[aria-label="Start sharing"]');
  }
  return Promise.resolve(page);
};

const generateClientConfig = (webcam = false, microphone = false) => {
  return {
    username: username.getRandom(),
    webcam,
    microphone,
  };
};

async function start(
  bbbClient,
  logger,
  meetingID,
  testDuration,
  clientWithCamera,
  clientWithMicrophone,
  clientListening
) {
  const [browser, meetingPassword] = await Promise.all([
    puppeteer.launch({
      executablePath: "/usr/bin/chromium", // Use the installed Chromium binary
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--use-fake-device-for-media-stream",
        "--use-fake-ui-for-media-stream",
        "--mute-audio",
      ],
    }),
    bbbClient.getModeratorPassword(meetingID),
  ]);

  const clientsConfig = [
    ...[...Array(clientWithCamera)].map(() => generateClientConfig(true, true)),
    ...[...Array(clientWithMicrophone)].map(() =>
      generateClientConfig(false, true)
    ),
    ...[...Array(clientListening)].map(() =>
      generateClientConfig(false, false)
    ),
  ];

  for (let idx = 0; idx < clientsConfig.length; idx++) {
    logger.info(`${clientsConfig[idx].username} join the conference`);
    await initClient(
      browser,
      logger,
      bbbClient.getJoinUrl(
        clientsConfig[idx].username,
        meetingID,
        meetingPassword
      ),
      clientsConfig[idx].webcam,
      clientsConfig[idx].microphone
    ).catch((err) => {
      logger.error(
        `Unable to initialize client ${clientsConfig[idx].username} : ${err}`
      );
      Promise.resolve(null);
    });
  }

  logger.info("All user joined the conference");
  logger.info(`Sleeping ${testDuration}s`);
  await new Promise((resolve) => setTimeout(resolve, testDuration * 1000));
  logger.info("Test finished");
  return browser.close();
}

module.exports = {
  start,
};
