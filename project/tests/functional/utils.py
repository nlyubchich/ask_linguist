import unittest
import random
import string
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException

UPPERCASE_AND_DIGITS = string.ascii_uppercase + string.digits


class SeleniumTest(unittest.TestCase):
    page = None

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.implicitly_wait(10)
        self.base_url = "http://localhost:5000"
        self.verificationErrors = []
        self.accept_next_alert = True
        self.user_id = generate_random_string()
        self.register_new_user()
        if self.page:
            self.driver.get(self.base_url + self.page)

    def register_new_user(self):
        driver = self.driver
        driver.get(self.base_url + '/register')

        driver.find_element_by_css_selector('input[name="email"]').clear()
        driver.find_element_by_css_selector('input[name="email"]').send_keys(
            self.user_id + "@example.com")
        driver.find_element_by_css_selector('input[name="nick_name"]').clear()
        driver.find_element_by_css_selector('input[name="nick_name"]'
                                            ).send_keys(self.user_id)
        driver.find_element_by_css_selector('input[name="first_name"]').clear()
        driver.find_element_by_css_selector('input[name="first_name"]'
                                            ).send_keys(self.user_id)
        driver.find_element_by_css_selector('input[name="last_name"]').clear()
        driver.find_element_by_css_selector('input[name="last_name"]'
                                            ).send_keys(self.user_id)
        driver.find_element_by_css_selector('input[name="password"]').clear()
        driver.find_element_by_css_selector('input[name="password"]'
                                            ).send_keys(self.user_id)
        driver.find_element_by_css_selector('input[type="submit"]').click()

    def is_element_present(self, how, what):
        try:
            self.driver.find_element(by=how, value=what)
        except NoSuchElementException:
            return False
        return True

    def is_alert_present(self):
        try:
            self.driver.switch_to.alert()
        except NoAlertPresentException:
            return False
        return True

    def close_alert_and_get_its_text(self):
        try:
            alert = self.driver.switch_to.alert()
            alert_text = alert.text
            if self.accept_next_alert:
                alert.accept()
            else:
                alert.dismiss()
            return alert_text
        finally:
            self.accept_next_alert = True

    def tearDown(self):
        driver = self.driver
        js_errors = driver.find_element_by_id('js-errors').text
        if self._test_has_failed() or js_errors:
            fail_path = 'project/tests/functional/' + generate_random_string()
            driver.save_screenshot(fail_path + '.png')

            with open(fail_path + '.html', 'w') as f:
                f.write(driver.page_source)

        driver.quit()
        self.assertFalse(js_errors)
        self.assertEqual([], self.verificationErrors)

    def _test_has_failed(self):
        # for 3.4. In 3.3, can just use self._outcomeForDoCleanups.success:
        for method, error in self._outcome.errors:
            if error:
                return True
        return False


def generate_random_string(size=10, chars=UPPERCASE_AND_DIGITS):
    return ''.join(random.choice(chars) for _ in range(size))
