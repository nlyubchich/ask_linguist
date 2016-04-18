import unittest
import random
import string
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException


class SeleniumTest(unittest.TestCase):
    page = None

    def setUp(self):
        options = webdriver.ChromeOptions()
        options.add_argument('--user-data-dir --no-sandbox')
        options.binary_location = '/usr/bin/chromium-browser'
        self.driver = webdriver.Chrome(chrome_options=options)
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
        driver.get(self.base_url + "/register")
        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys(
            self.user_id + "@example.com")
        driver.find_element_by_id("nick_name").clear()
        driver.find_element_by_id("nick_name").send_keys(self.user_id)
        driver.find_element_by_id("first_name").clear()
        driver.find_element_by_id("first_name").send_keys(self.user_id)
        driver.find_element_by_id("last_name").clear()
        driver.find_element_by_id("last_name").send_keys(self.user_id)
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys(self.user_id)
        driver.find_element_by_css_selector("input[type=\"submit\"]").click()

    def is_element_present(self, how, what):
        try:
            self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e:
            return False
        return True

    def is_alert_present(self):
        try:
            self.driver.switch_to.alert()
        except NoAlertPresentException as e:
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
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)


def generate_random_string(size=10,
                           chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))
