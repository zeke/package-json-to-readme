Replace all functionality with plugins that can work on an existing README.

All current Hogan template fields and their replacement plugin status:

# name -  update-readme-name-and-description
- [x] {{name}}
- [ ] {{travis_url}} - ?
- [x] {{description}}

## Installation - update-readme-installation
- [x] {{private}}
  - slight behavior modification, it puts "npm install repo_url" instead of skipping completely
- [x] {{preferGlobal}}

## Usage

- [ ] {{usage}}
- [ ] {{language}}
- [ ] {{{content}}}

## Tests

- [ ] {{scripts.test}}
- [ ] {{testOutput}}

## Dependencies
- [ ] {{depDetails}}
  - [ ] {{name}}
  - [ ] {{repository.url}}
  - [ ] {{description}}

## Dev Dependencies
- [ ] {{devDepDetails}}
  - [ ] {{name}}
  - [ ] {{repository.url}}
  - [ ] {{description}}

## License - update-readme-license
- [x] {{license}}