import time
from selenium.webdriver.common.by import By
from project.tests.functional.utils import SeleniumTest, generate_random_string


class TestDashboard(SeleniumTest):
    page = '/dashboard/'

    def add_phrase(self, source_lang, source_text, translated_lang,
                   translated_text):
        driver = self.driver
        new_phrase_inputs = '(//tr[@class="b-vocabulary-table__row b-vocabulary-table__row--active"]/td/input)'

        driver.find_elements_by_class_name('b-add-btn')[0].click()
        source_lang_input = new_phrase_inputs + '[1]'
        driver.find_element_by_xpath(source_lang_input).clear()
        driver.find_element_by_xpath(source_lang_input).send_keys(source_lang)
        source_text_input = new_phrase_inputs + '[2]'
        driver.find_element_by_xpath(source_text_input).clear()
        driver.find_element_by_xpath(source_text_input).send_keys(source_text)
        translated_lang_input = new_phrase_inputs + '[3]'
        driver.find_element_by_xpath(translated_lang_input).clear()
        driver.find_element_by_xpath(translated_lang_input).send_keys(
            translated_lang
        )
        translated_text_input = new_phrase_inputs + '[4]'
        driver.find_element_by_xpath(translated_text_input).clear()
        driver.find_element_by_xpath(translated_text_input).send_keys(
            translated_text
        )
        driver.find_element_by_css_selector('input[value="Save"]').click()

        for i in range(10):  # 10*0.5 = 5 seconds
            if self.is_element_present(By.CSS_SELECTOR, 'td'):
                break
            time.sleep(0.5)
        else:
            self.fail('time out')

    def test_new_phrases(self):
        driver = self.driver
        source_lang = 'French'
        translated_lang = 'English'
        source_text_1 = generate_random_string()
        translated_text_1 = generate_random_string()
        source_text_2 = generate_random_string()
        translated_text_2 = generate_random_string()

        self.add_phrase(
            source_lang=source_lang,
            source_text=source_text_1,
            translated_lang=translated_lang,
            translated_text=translated_text_1,
        )
        self.add_phrase(
            source_lang=source_lang,
            source_text=source_text_2,
            translated_lang=translated_lang,
            translated_text=translated_text_2,
        )

        # most recent (second) phrase
        phrase_row_selector = '//tr[@class="b-vocabulary-table__row"][1]/'
        self.assertEqual(
            source_lang,
            driver.find_element_by_xpath(phrase_row_selector + 'td[1]').text,
        )
        self.assertEqual(
            source_text_2,
            driver.find_element_by_xpath(phrase_row_selector + 'td[2]').text,
        )
        self.assertEqual(
            translated_lang,
            driver.find_element_by_xpath(phrase_row_selector + 'td[3]').text,
        )
        self.assertEqual(
            translated_text_2,
            driver.find_element_by_xpath(phrase_row_selector + 'td[4]').text,
        )
        self.assertEqual(
            'width: 0%;',
            driver.find_element_by_css_selector(
                'div.progress-level').get_attribute('style'),
        )

        # first added phrase
        phrase_row_selector = '//tr[@class="b-vocabulary-table__row"][2]/'
        self.assertEqual(
            source_lang,
            driver.find_element_by_xpath(phrase_row_selector + 'td[1]').text,
        )
        self.assertEqual(
            source_text_1,
            driver.find_element_by_xpath(phrase_row_selector + 'td[2]').text,
        )
        self.assertEqual(
            translated_lang,
            driver.find_element_by_xpath(phrase_row_selector + 'td[3]').text,
        )
        self.assertEqual(
            translated_text_1,
            driver.find_element_by_xpath(phrase_row_selector + 'td[4]').text,
        )
        self.assertEqual(
            'width: 0%;',
            driver.find_element_by_css_selector(
                'div.progress-level').get_attribute('style'),
        )

    def test_edit_phrase(self):
        driver = self.driver
        source_lang = 'French'
        translated_lang = 'English'
        source_text_1 = generate_random_string()
        translated_text_1 = generate_random_string()
        source_text_2 = generate_random_string()
        translated_text_2 = generate_random_string()

        edited_source_lang_1 = generate_random_string()
        edited_translated_lang_1 = generate_random_string()
        edited_source_lang_2 = generate_random_string()
        edited_translated_lang_2 = generate_random_string()
        edited_source_text_1 = generate_random_string()
        edited_translated_text_1 = generate_random_string()
        edited_source_text_2 = generate_random_string()
        edited_translated_text_2 = generate_random_string()

        self.add_phrase(
            source_lang=source_lang,
            source_text=source_text_1,
            translated_lang=translated_lang,
            translated_text=translated_text_1,
        )
        self.add_phrase(
            source_lang=source_lang,
            source_text=source_text_2,
            translated_lang=translated_lang,
            translated_text=translated_text_2,
        )

        active_phrase_selector = (
            '(//tr[@class="b-vocabulary-table__row b-vocabulary-table__row--active"]/td/input)'
        )
        driver.find_element_by_xpath('(//input[@value="Edit"])[2]').click()
        driver.find_element_by_xpath(active_phrase_selector + '[1]').clear()
        driver.find_element_by_xpath(active_phrase_selector + '[1]').send_keys(
            edited_source_lang_2)
        driver.find_element_by_xpath(active_phrase_selector + '[2]').clear()
        driver.find_element_by_xpath(active_phrase_selector + '[2]').send_keys(
            edited_source_text_2)
        driver.find_element_by_xpath(active_phrase_selector + '[3]').clear()
        driver.find_element_by_xpath(active_phrase_selector + '[3]').send_keys(
            edited_translated_lang_2)
        driver.find_element_by_xpath(active_phrase_selector + '[4]').clear()
        driver.find_element_by_xpath(active_phrase_selector + '[4]').send_keys(
            edited_translated_text_2)
        driver.find_element_by_css_selector('input[value="Save"]').click()

        row_2_selector = '//tr[@class="b-vocabulary-table__row"][2]/'
        self.assertEqual(
            edited_source_lang_2,
            driver.find_element_by_xpath(
                row_2_selector+'td[1]').text
        )
        self.assertEqual(
            edited_source_text_2,
            driver.find_element_by_xpath(
                row_2_selector+'td[2]').text
        )
        self.assertEqual(
            edited_translated_lang_2,
            driver.find_element_by_xpath(
                row_2_selector+'td[3]').text
        )
        self.assertEqual(
            edited_translated_text_2,
            driver.find_element_by_xpath(
                row_2_selector+'td[4]').text
        )

        driver.find_element_by_xpath('(//input[@value="Edit"])[1]').click()
        driver.find_element_by_xpath(active_phrase_selector + '[1]').clear()
        driver.find_element_by_xpath(active_phrase_selector + '[1]').send_keys(
            edited_source_lang_1)
        driver.find_element_by_xpath(active_phrase_selector + '[2]').clear()
        driver.find_element_by_xpath(active_phrase_selector + '[2]').send_keys(
            edited_source_text_1)
        driver.find_element_by_xpath(active_phrase_selector + '[3]').clear()
        driver.find_element_by_xpath(active_phrase_selector + '[3]').send_keys(
            edited_translated_lang_1)
        driver.find_element_by_xpath(active_phrase_selector + '[4]').clear()
        driver.find_element_by_xpath(active_phrase_selector + '[4]').send_keys(
            edited_translated_text_1)
        driver.find_element_by_css_selector('input[value="Save"]').click()

        row_1_selector = '//tr[@class="b-vocabulary-table__row"][1]/'
        self.assertEqual(
            edited_source_lang_1,
            driver.find_element_by_xpath(
                row_1_selector+'td[1]').text
        )
        self.assertEqual(
            edited_source_text_1,
            driver.find_element_by_xpath(
                row_1_selector+'td[2]').text
        )
        self.assertEqual(
            edited_translated_lang_1,
            driver.find_element_by_xpath(
                row_1_selector+'td[3]').text
        )
        self.assertEqual(
            edited_translated_text_1,
            driver.find_element_by_xpath(
                row_1_selector+'td[4]').text
        )

    def test_delete_phrase(self):
        driver = self.driver

        source_lang = 'French'
        translated_lang = 'English'
        source_text_1 = generate_random_string()
        translated_text_1 = generate_random_string()
        source_text_2 = generate_random_string()
        translated_text_2 = generate_random_string()

        self.add_phrase(
            source_lang=source_lang,
            source_text=source_text_1,
            translated_lang=translated_lang,
            translated_text=translated_text_1,
        )
        self.add_phrase(
            source_lang=source_lang,
            source_text=source_text_2,
            translated_lang=translated_lang,
            translated_text=translated_text_2,
        )

        self.assertEqual(len(driver.find_elements(By.CSS_SELECTOR, 'tr')), 3)

        driver.find_element_by_xpath('(//input[@value="Edit"])[2]').click()
        driver.find_element_by_xpath('//input[@value="Delete"]').click()
        self.assertEqual(len(driver.find_elements(By.CSS_SELECTOR, 'tr')), 2)

        phrase_row_selector = '//tr[@class="b-vocabulary-table__row"][1]/'
        self.assertEqual(
            source_lang,
            driver.find_element_by_xpath(phrase_row_selector + 'td[1]').text,
        )
        self.assertEqual(
            source_text_2,
            driver.find_element_by_xpath(phrase_row_selector + 'td[2]').text,
        )
        self.assertEqual(
            translated_lang,
            driver.find_element_by_xpath(phrase_row_selector + 'td[3]').text,
        )
        self.assertEqual(
            translated_text_2,
            driver.find_element_by_xpath(phrase_row_selector + 'td[4]').text,
        )
        self.assertEqual(
            'width: 0%;',
            driver.find_element_by_css_selector(
                'div.progress-level').get_attribute('style'),
        )

        driver.find_element_by_xpath('//input[@value="Edit"]').click()
        driver.find_element_by_xpath('//input[@value="Delete"]').click()
        self.assertEqual(len(driver.find_elements(By.CSS_SELECTOR, 'tr')), 1)
