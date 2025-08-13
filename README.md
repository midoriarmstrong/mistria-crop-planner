# Fields of Mistria Crop Planner

**([Live Version](https://midoriarmstrong.github.io/mistria-crop-planner/))**

## About

The Fields of Mistria crop planner is a tool for planning and optimizing your crops in [Fields of Mistria](https://www.fieldsofmistria.com/). Its overall UI design was based off of exnil's [Stardew Valley Crop Planner](https://exnil.github.io/crop_planner/), but the code itself was rewritten from scratch in React.

## Current planned functionality

- Some kind of recipe UI (to see the daily profit when ex. tea is processed into Rose Tea.)

## Development

### Prerequisites

This website was developed on [Node 22](https://nodejs.org/en/download), though it may still run on older versions of Node.

### Run locally

```bash
git clone https://github.com/midoriarmstrong/mistria-crop-planner.git
cd mistria-crop-planner
npm install
npm start
```

The site should be up at [localhost:5173](http://localhost:5173).

### Adding a new crop

To update the list of icons in [src/constants/icon-constants.ts](/src/constants/icon-constants.ts):

1. Add the crop sprite to `src/assets/crops/` and the seed sprite to `src/assets/seeds/`
2. Add the crop details to the `CROPS` const in [src/constants/table/Crops.ts](/src/constants/table/Crops.ts).
3. Run `npm run generate:constants:icons`.

### Forking

If you'd like to fork this repository, you'll need to configure your fork's settings to correctly publish to your GitHub pages URL.

1. Go to `Settings` --> `Pages`.
2. Under `Build and deployment`, set `Source` to `GitHub Actions`.
3. Re-run the `Deploy to GitHub Pages` action if needed.

## Licensing

All included image assets are copyright © NPC Studio or any other respective owners, and are not included under the MIT license of the project code. Assets are used under fair use provisions. No part of this project is for profit.
