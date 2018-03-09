# [Finder](https://finder.hackclub.com)

Find all the Hack Clubs near you!

## Contributing

1. Clone this repository by running `git clone https://github.com/hackclub/finder`.
2. Run `npm install` or `yarn` to install all required dependencies.
3. Run `yarn add [package]` to install a package. This will keep the `yarn.lock` file updated.
4. Hack away!

### Adding school images

1. Make sure the image file is placed in `assets/images/school` and follows the `[club_id].jpg` filename format. You can find a club's ID [here](https://api.hackclub.com/v1/clubs).
2. Run `gulp compress:images`. This will perform minify and resize the images.
3. Profit!

## License

[MIT](LICENSE.txt)