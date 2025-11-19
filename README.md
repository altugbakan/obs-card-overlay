# OBS Card Overlay

OBS Browser Source overlay for MTG cards, best used for set reviews.

## Requirements

- [uv](https://docs.astral.sh/uv/)

## Running the App

```shell
uv run app.py
```

## Usage
After running the app, open http://localhost:5050/control from your browser. Add http://localhost:5050/overlay as a Browser Source to OBS.

You can then search for a card on the control tab and you should see the card preview mirrored to the overlay.

### Keybinds

| Key(s)        | Action                         |
| ------------- | ------------------------------ |
| `Enter`       | Send current card to overlay   |
| `Tab`         | Show card on preview           |
| `←`, `H`      | Go to previous card in history |
| `→`, `L`      | Go to next card in history     |
| `F`           | Flip the current card          |
| `↑`, `N`, `K` | Go to next card                |
| `↓`, `B`, `J` | Go to previous card            |
| `/`           | Focus the input field          |

### Extras

You can drop an image from Scryfall on your overlay window to show that card. The search bar also supports Scryfall search.