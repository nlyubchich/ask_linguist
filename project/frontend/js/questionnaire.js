import { tanok } from 'tanok';
import { init, QuestionnaireDispatcher, Questionnaire } from './Questionnaire';
import { fetchGraphData } from './utils';
import Baz from 'bazooka';

function initQuestionnaire(node) {
  const language = node.dataset.language;
  fetchGraphData(`
    [{
      (
        :phrases-for-test {
          :limit 50
          :language ${language}
        }
      ) [
        :sourceText
        :translatedText
      ]
    }]
  `).then((payload) => {
    tanok(
      init(payload, language),
      (new QuestionnaireDispatcher).collect(),
      Questionnaire,
      { container: node }
    );
  });
}

Baz.register({
  questionnaire: initQuestionnaire,
});

Baz.refresh();
