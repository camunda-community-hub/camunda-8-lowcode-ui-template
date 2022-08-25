const messages = {
  en: {
    message: {
	  tasks: 'Tasks',
	  mytasks:'My tasks',
	  unassignedtasks:'Unassigned tasks',
	  archivedtasks:'My closed tasks',
	  processes: 'Processes',
	  newInstance:'New instance',
	  instanceConfirmation:'Process instance started',
	  open:'Open',
	  submit:'Submit',
	  claim: 'Claim',
	  unclaim: 'Unclaim',
      hello: 'Camunda'
    }
  },
  de: {
    message: {
	  tasks: 'Aufgaben',
	  mytasks:'Meine Aufgaben',
	  unassignedtasks:'Offene Aufgaben',
	  archivedtasks:'Abgeschlossene Aufgaben',
	  processes: 'Prozesse',
	  newInstance:'Neue Instanz',
	  instanceConfirmation:'Prozessinstanz gestartet',
	  open:'Öffnen',
	  submit:'Absenden',
	  claim: 'Übernehmen',
	  unclaim: 'Abgeben',
      hello: 'Camunda'
    }
  },
  fr: {
    message: {
	  tasks:'Tâches',
	  mytasks:'Mes tâches',
	  unassignedtasks:'Tâches non assignées',
	  archivedtasks:'Mes tâches archivées',
	  processes: 'Procédures',
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
  locale: 'en', // set locale
  messages, // set locale messages
})


Vue.component('translate-menu',{ template: '<div class="dropdown localeDropdown">'+
			 ' <button class="dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false"><i class="bi bi-translate"></i></button>'+
			  '<div class="dropdown-menu">'+
				'<div class="dropdown-item">'+
					'<a @click="english()">English</a>'+
				'</div>'+
				'<div class="dropdown-item">'+
					'<a @click="german()">Deutsch</a>'+
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
    german() {
		i18n.locale='de';
    },
    french() {
		i18n.locale='fr';
    },
  }
});
