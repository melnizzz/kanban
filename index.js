'use strict'
var buttonsNewCard = document.querySelectorAll('.button_card');
var buttonNewColumn = document.querySelector('.button_column');
var cards = document.querySelectorAll('.column__card');
var i, idCounter, dragCard, shadowCard;

idCounter = 0;

for (i = 0; i < buttonsNewCard.length; i++) {
	buttonsNewCard[i].addEventListener('click', function(event) {
		newCard(event);
	});
}

buttonNewColumn.addEventListener('click', function(event) {
	newColumn(event);
});

for (i = 0; i < cards.length; i++) {
	cards[i].addEventListener('mousedown', function(event) {
		//Если уже есть одна перетаскиваемая карточка, то ничего не делаем
		if (dragCard) return;
		var card;
		if (event.target.classList.contains('column__card')) {
			card = event.target;
		}
		if (event.target.parentNode.classList.contains('column__card')) {
			card = event.target.parentNode;
		}
		
		dragCard = card;
		card.style.opacity = 0.5;
	});
}
	
document.addEventListener('mouseup', function(event) {
	if (!dragCard) return;
	var drag = dragCard;
	dragCard = null;
	var card = null;
	var wrap = null;
	
	//Если есть тень карточки, то заменяем ее на сам элемент
	if (shadowCard) {
		wrap = shadowCard.parentNode;
		card = shadowCard.nextSibling;
		shadowCard.remove();
		shadowCard = null;
		wrap.insertBefore(drag, card);
	}
	
	//Возвращаем видимость переносимому элементу
	drag.style.opacity = 1;
	drag.style.display = 'block';
});

document.addEventListener('mousemove', function(event) {
	var card = null;
	var wrap = null;
	var column = null;
	var cardMiddle, mouseTop;
	var isMouseUnder = undefined;
	//Если нет перетаскиваемой карточки, то ничего не делаем
	if (!dragCard) return;
	
	//Отмена выделения текста
	event.preventDefault();
	//Скрываем перетаскиваемую карточку
	dragCard.style.display = 'none';
	
	//Определяем, над чем находится курсор
	if (event.target.classList.contains('column__card')) {
		card = event.target;
		wrap = card.parentNode;
		if (card.classList.contains('shadow')) {
			card = null;
			wrap = null;
		}
	}
	if (event.target.parentNode.classList.contains('column__card')) {
		card = event.target.parentNode;
		wrap = card.parentNode;
		if (card.classList.contains('shadow')) {
			card = null;
			wrap = null;
		}
	}
	
	//Если курсор над карточкой
	if (card != null) {
		
		cardMiddle = card.getBoundingClientRect().top + pageYOffset + card.offsetHeight / 2;
		mouseTop = event.clientY;
		
		//Если положение тени изменилось или ее вообще нет, создаем новую
		if (!shadowCard || (shadowCard && (isMouseUnder != mouseTop > cardMiddle))) {
			//Удаляем страую тень, если она есть
			if (shadowCard) {
				shadowCard.remove();
			}
			//Создаем новую
			shadowCard = dragCard.cloneNode(true);
			shadowCard.classList.add('shadow');
			shadowCard.style.display = 'block';
			shadowCard.style.opacity = 0.3;
		
			isMouseUnder = mouseTop > cardMiddle;
			
			//Вставляем ее
			if (isMouseUnder) {
				wrap.insertBefore(shadowCard, card.nextSibling);
			}
			else {
				wrap.insertBefore(shadowCard, card);
			}
		}
		return;
	}
	
	//Если курсор над пустой колонкой
	if (event.target.classList.contains('column')) {
		column = event.target;
	}
	else 
		if (event.target.parentNode.classList.contains('column')) {
			column = event.target.parentNode;
		}
		else 
			if (event.target.parentNode.parentNode.classList.contains('column')) {
				column = event.target.parentNode.parentNode;
			}
	wrap = column.querySelector('.column__wrap');
	if (wrap.childNodes.length == 0) {
		//Удаляем страую тень, если она есть
		if (shadowCard) {
			shadowCard.remove();
		}
		//Создаем новую
		shadowCard = dragCard.cloneNode(true);
		shadowCard.classList.add('shadow');
		shadowCard.style.display = 'block';
		shadowCard.style.opacity = 0.3;
		
		//Вставляем ее
		wrap.appendChild(shadowCard);
	}
	
	//Если курсор не над карточкой, убираем тень
	else {
		if (shadowCard) {
			shadowCard.remove();
		}
		shadowCard = null;
	}
});

//Добавление новой карточки
function newCard(event) {
	var newInput, newCard, butAdd, butClose, butContainer, wrap;
	var but = event.target.closest('.button_card');
	
	but.setAttribute('id', 'hiddenButton' + idCounter);
	but.style.display = 'none';
	
	//Создание карточки
	newCard = document.createElement('label');
	newCard.setAttribute('for', 'i' + idCounter);
	newCard.classList.add('column__card');
	wrap = but.parentNode.querySelector('.column__wrap');
	wrap.appendChild(newCard);
	
	//Скрытое поле ввода текста в карточку
	newInput = document.createElement('textarea');
	newInput.classList.add('column__input');
	newInput.setAttribute('id', 'i' + idCounter);
	newInput.setAttribute('rows', 3);
	newInput.setAttribute('placeholder', 'Введите название карточки');
	newCard.appendChild(newInput);
	newInput.focus();
	
	//Создание кнопок для добавления карточки и отмены
	butContainer = document.createElement('div');
	butContainer.classList.add('button_container');
	butAdd = document.createElement('button');
	butAdd.classList.add('button_add', 'button');
	butAdd.innerHTML = 'Добавить карточку';
	
	butClose = document.createElement('button'); 
	butClose.classList.add('button_close', 'button');
	butClose.innerHTML = '&times;';
	
	butContainer.appendChild(butAdd);
	butContainer.appendChild(butClose);
	but.parentNode.appendChild(butContainer);
	
	//Проматываем карточки вниз до новой
	wrap.scrollTop = wrap.scrollHeight;
	
	//Обработка добавления карточки с помощью кнопки
	butAdd.addEventListener('click', function(event) {
		addCard(butAdd);
	});
	//Обработка добавления карточки клавиши Enter
	newInput.addEventListener('keydown', function(event) {
		if (event.keyCode == '13') {
			addCard(butAdd);
		}
	});
	
	//Обработка отмены
	butClose.addEventListener('click', function(event) {
		var input = event.target.parentNode.parentNode.querySelector('.column__input');
		var card = input.parentNode;
		var count = input.getAttribute('id').slice(1);
		var but = document.getElementById('hiddenButton' + count);
	
		card.remove();
		event.target.parentNode.remove();
		but.style.display = 'block';
		but.removeAttribute('id');
	});
	
	idCounter++;
}

//Подтверждение добавления карточки
function addCard(but) {
	var input = but.parentNode.parentNode.querySelector('.column__input');
	var card = input.parentNode;
	var cardText = input.value;
	var count = input.getAttribute('id').slice(1);
	
	if (input.value.trim() != '') {
		input.remove();
		card.removeAttribute('for');
		card.innerHTML = cardText;
		but.parentNode.remove();
		document.getElementById('hiddenButton' + count).style.display = 'block';
	}
	else {
		card.style.borderTop = '1px solid #a00';
		card.style.borderBottom = '1px solid #a00';
		setTimeout(function() {card.style.border = 'none';}, 100);
	}
}

//Добавление новой колонки
function newColumn(event) {
	var newInput, newTitle, butAdd, butClose, butContainer, column;
	var but = event.target.closest('.button_column');
	
	var column = document.createElement('section');
	column.classList.add('column');
	var newButton = but.cloneNode(true);
	newButton.setAttribute('id', 'button_column_new');
	column.appendChild(newButton);
	document.body.appendChild(column);
	but.setAttribute('id', 'hiddenButton' + idCounter);
	but.style.display = 'none';
	
	column = but.parentNode;
	
	//Создание колонки
	newTitle = document.createElement('label');
	newTitle.setAttribute('for', 'i' + idCounter);
	newTitle.classList.add('column__title_new');
	column.appendChild(newTitle);
	
	//Скрытое поле ввода текста в название колонки
	newInput = document.createElement('input');
	newInput.setAttribute('type', 'text');
	newInput.classList.add('column__title__input');
	newInput.setAttribute('id', 'i' + idCounter);
	newInput.setAttribute('placeholder', 'Введите название колонки');
	newTitle.appendChild(newInput);
	newInput.focus();
	
	//Создание кнопок для добавления колонки и отмены
	butContainer = document.createElement('div');
	butContainer.classList.add('button_container');
	butAdd = document.createElement('button');
	butAdd.classList.add('button_add', 'button');
	butAdd.innerHTML = 'Добавить колонку';
	
	butClose = document.createElement('button'); 
	butClose.classList.add('button_close', 'button');
	butClose.innerHTML = '&times;';
	
	butContainer.appendChild(butAdd);
	butContainer.appendChild(butClose);
	column.appendChild(butContainer);
	
	//add new column button
	
	//Обработка добавления колонки
	butAdd.addEventListener('click', function(event) {
		but.remove();
		addColumn(butAdd);
	});
	newInput.addEventListener('keydown', function(event) {
		if (event.keyCode == '13') {
			but.remove();
			addColumn(butAdd);
		}
	});
	
	//Обработка отмены
	butClose.addEventListener('click', function(event) {
		var input = event.target.parentNode.parentNode.querySelector('.column__title__input');
		var title = input.parentNode;
	
		title.remove();
		event.target.parentNode.remove();
		but.style.display = 'block';
		but.removeAttribute('id');
		
		var newBut = document.getElementById('button_column_new');
		newBut.parentNode.remove();
	});
	
	idCounter++;
}

function addColumn(button) {
	var input = button.parentNode.parentNode.querySelector('.column__title__input');
	var title = input.parentNode;
	var titleText = input.value;
	var but, butPlus, butText, columnWrap;
	
	if (input.value.trim() != '') {
		input.remove();
		title.removeAttribute('for');
		title.innerHTML = titleText;
		title.classList.remove('column__title_new');
		title.classList.add('column__title');
		button.parentNode.remove();
		
		//Добавление остального содержимого колонок
		columnWrap = document.createElement('div'); 
		columnWrap.classList.add('column__wrap');
		title.parentNode.appendChild(columnWrap);
		
		but = document.createElement('button'); 
		but.classList.add('button_card', 'button');
		butPlus = document.createElement('span'); 
		butPlus.classList.add('button__plus');
		butPlus.innerHTML = '+';
		but.appendChild(butPlus);
		
		butText = document.createElement('span'); 
		butText.classList.add('button__text');
		butText.innerHTML = 'Добавить еще одну карточку';
		but.appendChild(butText);
		title.parentNode.appendChild(but);
		
		but.addEventListener('click', function(event) {
			newCard(event);
		});
		
		
		var newBut = document.getElementById('button_column_new');
		newBut.addEventListener('click', function(event) {newColumn(event);});
		newBut.removeAttribute('id');
		
		}
		else {
			title.style.borderTop = '1px solid #a00';
			title.style.borderBottom = '1px solid #a00';
			setTimeout(function() {title.style.border = 'none';}, 100);
		}
}
