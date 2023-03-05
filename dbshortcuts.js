const chatInput = $('#duel .cin_txt');
const lifeInput = $('#life_txt');
const dieButton = $('#die_btn');
const coinButton = $('#coin_btn');
const tokenButton = $('#duel .token_btn');
const goodButton = $('#good_btn');
const thinkButton = $('#think_btn');
const shuffleButton = $('#shuffle_btn');
const showHandButton = $('#show_hand_btn');
const viewExitButton = $('#view')[0].getElementsByClassName("exit_btn");
const phaseButtons = [$('#dp'), $('#sp'), $('#m1'), $('#bp'), $('#m2'), $('#ep')];
const extraHidden = $('#extra_hidden');
const deckHidden = $('#deck_hidden');
const graveyardHidden = $('#grave_hidden');
const banishHidden = $('#banished_hidden');
const leftEMZ = $('#link_left_select');
const rightEMZ = $('#link_right_select');
const fieldZone = $('#field_spell1_select');
const skipIntroButton = $('#skip_intro_btn');
const loginOkayButton = $('#combo > div.ok_btn');
const loginDuelButton = $('#duel_btn');
const duelRoomButton = $('#room_btn');

const clickEvent = new Event("click", {bubbles: true, cancelable: true});
const mouseoverEvent = new Event("mouseover", {bubbles: true, cancelable: true});

var config = {};

function findMonsterCard(index, player = player1) {
    monsters = [player.m1, player.m2, player.m3, player.m4, player.m5];
    return monsters[index];
}

function findSpellTrapCard(index, player = player1) {
    spellTraps = [player.s1, player.s2, player.s3, player.s4, player.s5];
    return spellTraps[index];
}

function findHoverMenuKey(event, key) {
    const cardMenu = menu.find('#card_menu_content');
    if (!cardMenu.is(":visible")) {
        return null;
    }
    for (const ignoreCaseSensitive of [false, true]) {
        for (const entry of cardMenu.children()) {
            if (entry.caseSensitive && !ignoreCaseSensitive) {
                if ((event.shiftKey && (key.toUpperCase() === entry.key)) || (!event.shiftKey && (key === entry.key))) {
                    return entry;
                }
            } else {
                if (key === entry.key.toLowerCase()) {
                    return entry;
                }
            }
        }
    }
    return null;
}

function keyUpHoverMenu(event, key) {
    const entry = findHoverMenuKey(event, key);
    if (entry) {
        entry.dispatchEvent(clickEvent);
        return true;
    }
    return false;
}

function keyUpPhases(event) {
    if (!event.altKey) {
        return false;
    }
    for (let i in phaseButtons) {
        if (event.code === config.phases[i]) {
            phaseButtons[i][0].dispatchEvent(clickEvent);
            return true;
        }
    }
    return false;
}

function keyUpZones(event, key) {
    for (let i = 0; i < config.zones.length; i++) {
        if (event.code !== config.zones[i]) {
            continue;
        }
        const monsterName = '#m' + (i + 1) + '_select';
        const spellTrapName = '#s' + (i + 1) + '_select';
        const monster = $(monsterName);
        const spellTrap = $(spellTrapName);
        if (monster.is(":visible") && spellTrap.is(":visible")) {
            const zone = (event.shiftKey ? spellTrap[0] : monster[0]);
            zone.dispatchEvent(clickEvent);
            return true;
        } else if (monster.is(":visible")) {
            monster[0].dispatchEvent(clickEvent);
            return true;
        } else if (spellTrap.is(":visible")) {
            spellTrap[0].dispatchEvent(clickEvent);
            return true;
        } else {
            const monsterCard = findMonsterCard(i);
            const spellTrapCard = findSpellTrapCard(i);
            let card = null;
            if (monsterCard && spellTrapCard) {
                card = (event.shiftKey ? spellTrapCard : monsterCard);
            } else {
                card = monsterCard || spellTrapCard;
            }
            if (card) {
                card.find('.content:first')[0].dispatchEvent(mouseoverEvent);
                return true;
            }
        }
    }
    let element = null;
    let card = null;
    if (event.code == config.leftEMZ) {
        element = leftEMZ;
        card = linkLeft;
    } else if (event.code == config.rightEMZ) {
        element = rightEMZ;
        card = linkRight;
    } else if (key == config.field) {
        element = fieldZone;
        card = player1.fieldSpell;
    }
    if (element && element.is(":visible")) {
        element[0].dispatchEvent(clickEvent);
        return true;
    }
    if (card) {
        card.find('.content:first')[0].dispatchEvent(mouseoverEvent);
        return true;
    }
    return false;
}

function clickWhenVisible(...elements) {
    for (const jquery of elements) {
        if (jquery.is(":visible")) {
            jquery[0].dispatchEvent(clickEvent);
            return true;
        }
    }
    return false;
}

function keyUpGlobalButtons(event, key) {
    switch (key) {
    case config.die:
        dieButton[0].dispatchEvent(clickEvent);
        return true;
    case config.key:
        coinButton[0].dispatchEvent(clickEvent);
        return true;
    case config.token:
        tokenButton[0].dispatchEvent(clickEvent);
        return true;
    case config.think:
        thinkButton[0].dispatchEvent(clickEvent);
        return true;
    case config.good:
        goodButton[0].dispatchEvent(clickEvent);
        return true;
    case config.shuffle:
        if (event.shiftKey) {
            shuffleButton[0].dispatchEvent(clickEvent);
            return true;
        }
        break;
    case config.showHand:
        if (event.shiftKey) {
            showHandButton[0].dispatchEvent(clickEvent);
            return true;
        }
        break;
    case config.chat:
        chatInput.focus();
        return true;
    case config.life:
        lifeInput.focus();
        return true;
    case config.extra:
        extraHidden[0].dispatchEvent(mouseoverEvent);
        return true;
    case config.deck:
        deckHidden[0].dispatchEvent(mouseoverEvent);
        return true;
    case config.graveyardBanish:
        if (event.shiftKey) {
            banishHidden[0].dispatchEvent(clickEvent);
        } else {
            graveyardHidden[0].dispatchEvent(clickEvent);
        }
        return true;
    default:
        break;
    }
    return false;
}

function keyUpWebsiteMenu(event) {
    switch (event.code) {
    case config.skip:
        if (clickWhenVisible(skipIntroButton, loginOkayButton, loginDuelButton, duelRoomButton)) {
            return true;
        }
        break;
    default:
        break;
    }
    return false;
}

function keyUpEventHandler(event) {
    //console.log('key ' + event.key);
    //console.log('code ' + event.code);

    if (keyUpWebsiteMenu(event)) {
        return;
    }

    // Ignore keys if we are not dueling.
    // The standby phase button can be used to know if the website is in a duel.
    if (!$('#sp').is(":visible")) {
        return;
    }

    const key = event.key.toLowerCase();
    const activeElement = document.activeElement;
    const textFocus = ((activeElement === chatInput[0]) || (activeElement === lifeInput[0]));

    if (key === config.cancel.toLowerCase()) {
        if (textFocus) {
            document.activeElement.blur();
        } else {
            if (viewExitButton[0].clientHeight != 0) {
                viewExitButton[0].dispatchEvent(clickEvent);
            }
        }
        return;
    }
    if (textFocus) {
        return;
    }
    keyUpHoverMenu(event, key) || keyUpPhases(event) || keyUpZones(event, key) || keyUpGlobalButtons(event, key);
}

function modifyEntry(entry) {
    if (entry.modifiedUI) {
        return;
    }
    entry.modifiedUI = true;

    const textSpan = entry.getElementsByClassName("card_menu_txt")[0];
    const textContent = textSpan.textContent;

    const [key, caseSensitive] = config.menu[textContent];
    if (!key) {
        return;
    }
    entry.key = key;
    entry.caseSensitive = caseSensitive;

    const u = document.createElement('u');
    const newSpan = document.createElement('span');
    newSpan.className = 'card_menu_txt';

    const index = textContent.toLowerCase().search(key.toLowerCase());
    if (index < 0) {
        u.append(key);
        newSpan.append(textContent + ' (');
        newSpan.append(u);
        newSpan.append(')');
    } else {
        u.append(textContent[index]);
        newSpan.append(textContent.substring(0, index));
        newSpan.append(u);
        newSpan.append(textContent.substring(index + 1));
    }
    entry.append(newSpan);
    textSpan.remove();
}

const dbShowMenu = showMenu;
showMenu = function(card, dp) {
    dbShowMenu.apply(dbShowMenu, arguments);

    const cardMenu = menu.find('#card_menu_content');
    if (!cardMenu.is(":visible")) {
        return;
    }
    const entries = cardMenu.children();
    for (let i = entries.length; i-- > 0;) {
        modifyEntry(entries[i]);
    }
};

document.addEventListener('DBSConfigLoaded', function(e) {
    config = JSON.parse(e.detail);
    document.addEventListener('keyup', keyUpEventHandler, false);
});
