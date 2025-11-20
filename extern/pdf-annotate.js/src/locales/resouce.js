import i18next from 'i18next';

i18next.init(
  {
    lng: 'ko',
    debug: true,
    resources: {
      de: {
        translation: {
          ClickToAddText: 'Text durch Klick hinzufügen'
        }
      },
      es: {
        translation: {
          ClickToAddText: 'Haga clic para agregar texto'
        }
      },
      es_us: {
        translation: {
          ClickToAddText: 'Hacer clic para agregar texto'
        }
      },
      fr: {
        translation: {
          ClickToAddText: 'Cliquez pour ajouter du texte'
        }
      },
      it: {
        translation: {
          ClickToAddText: 'Fare clic per aggiungere il testo'
        }
      },
      ja: {
        translation: {
          ClickToAddText: 'クリックしてテキストを追加'
        }
      },
      ko: {
        translation: {
          ClickToAddText: '내용을 입력하십시오'
        }
      },
      nl: {
        translation: {
          ClickToAddText: 'Klik hier om tekst toe te voegen'
        }
      },
      pt: {
        translation: {
          ClickToAddText: 'Clique para adicionar texto'
        }
      },
      en: {
        translation: {
          ClickToAddText: 'Click to add text'
        }
      },
      ru: {
        translation: {
          ClickToAddText: 'Текст слайда'
        }
      },
      th: {
        translation: {
          ClickToAddText: 'คลิกเพื่อเพิ่มข้อความ'
        }
      },
      zh_cn: {
        translation: {
          ClickToAddText: '单击此处添加文本'
        }
      },
      zh_tw: {
        translation: {
          ClickToAddText: '按一下以新增文字'
        }
      }
    }
  },
  function(err, t) {
    if (err) {
      console.error(err);
    }
  }
);

export const LangDefine = {
  ClickToAddText: i18next.t('ClickToAddText')
};

export default {
  LangDefine
};
