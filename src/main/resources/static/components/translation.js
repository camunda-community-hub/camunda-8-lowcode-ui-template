const messages = {
  en: {
    message: {
	  mytasks:'My tasks',
	  unassignedtasks:'Unassigned tasks',
	  archivedtasks:'My closed tasks',
	  newInstance:'New instance',
	  instanceConfirmation:'Process instance started',
	  open:'Open',
	  submit:'Submit',
	  claim: 'Claim',
	  unclaim: 'Unclaim',
      hello: 'Camunda'
    }
  },
  fr: {
    message: {
	  mytasks:'Mes tâches',
	  unassignedtasks:'Tâches non assignées',
	  archivedtasks:'Mes tâches archivées',
	  newInstance:'Nouvelle procédure',
	  instanceConfirmation:'Procédure démarrée',
	  open:'Ouvrir',
	  submit:'Soumettre',
	  claim: 'Prendre',
	  unclaim: 'Libérer',
      hello: 'Camunda'
    }
  }
}

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'fr', // set locale
  messages, // set locale messages
})


Vue.component('translate-menu',{ template: '<div class="dropdown localeDropdown">'+
			 ' <button class="dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false"><i class="bi bi-translate"></i></button>'+
			  '<div class="dropdown-menu">'+
				'<div class="dropdown-item">'+
					'<a @click="english()">English</a>'+
				'</div>'+
				'<div class="dropdown-item">'+
					'<a @click="french()">Français</a>'+
				'</div>'+
			  '</div>'+
			'</div>',
  methods: {
    english() {
		i18n.locale='en';
    },
    french() {
		i18n.locale='fr';
    },
  }
});