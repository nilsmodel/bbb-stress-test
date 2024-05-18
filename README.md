# 🚀 Stress Testing Tool for BigBlueButton v3.0.0 🚀

This tool is designed to help you stress test your [BigBlueButton](https://bigbluebutton.org/) server, ensuring it can handle the load of numerous simultaneous users.

## Overview

This tool simulates client activity in a BigBlueButton (BBB) conference using [Puppeteer](https://pptr.dev/), making it easy to test the performance and scalability of your BBB server. 💻

## Getting Started

### Preparation

1. **Clone this repository** 📂
   ```sh
   git clone https://github.com/nilsmodel/bbb-stress-test.git
   cd bbb-stress-test
   ```

2. **Run `make bootstrap`** ⚙️
   ```sh
   make bootstrap
   ```
   
3. **Update the generated `.env` file** 🛠️ \
   Specify `BBB_URL` and `BBB_SECRET`. \
   You can get these values by running `bbb-conf --secret` on your BBB server.


### Ready to Launch Your Test? 🚀

1. **Manually start a meeting** on your BBB server. 📅

2. **Get the meeting ID** by running:
   ```sh
   make list-meetings
   ```

3. **Update your `.env` file** to set the following variables:
   - `BBB_MEETING_ID`: the meeting ID
   - `BBB_CLIENTS_LISTEN_ONLY`: the number of simultaneous clients to connect in "Listen only" mode
   - `BBB_CLIENTS_MIC`: the number of simultaneous clients to connect with an active microphone
   - `BBB_CLIENTS_WEBCAM`: the number of simultaneous clients to connect with an active webcam and microphone
   - `BBB_TEST_DURATION`: the duration of the test in seconds

4. **Run `make stress`** to launch the test suite:
   ```sh
   make stress
   ```

## Compatibility ✅

This tool is compatible with the following versions of BigBlueButton:

| Version           | Compatibility |
|-------------------|---------------|
| v3.0.0-alpha.6    | ✅             |


## To-Do 📝

- [ ] Implement a Web-GUI for configuration, test launch and reporting
- [ ] Implement reporting features, metrics and extend logging capabilities
- [ ] Update and resolve dependencies
- [ ] Revise the client simulation process with Puppeteer
- [ ] Add support for more complex user interaction scenarios
- [ ] Enhance documentation with examples and common use cases
- [ ] Create automated tests for the stress tool
- [ ] Optimize the performance for large-scale tests
- [ ] Integrate with CI/CD pipelines for automated testing
- [ ] Implement multi-language support

## Contributing 🤝

We welcome contributions! If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.
**This project is a fork of [openfun/bbb-stress-test](https://github.com/openfun/bbb-stress-test).**

## License 📄

This work is released under the MIT License (see [LICENSE](./LICENSE)).

---
***This project and repo is proudly supported & maintained for you by [Laterna.Tech](https://laterna.tech)*** 🚀

[<img src="https://laterna.tech/wp-content/uploads/2024/01/LT-1270x780px-768x472.png.webp" width="33%">](https://laterna.tech)
