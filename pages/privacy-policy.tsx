import Head from 'next/head';
import PageHeader from 'components/common/PageHeader';
import Footer from 'components/Footer';
import { Col, Container, Row } from 'react-bootstrap';
import styles from './text-page.module.scss';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Head>
        <title>Tabbied - Privacy Policy</title>
      </Head>

      <PageHeader title="Privacy Policy" />

      <section className={styles.textPageWrapper}>
        <Container>
          <Row>
            <Col>
              <h2>Privacy Notice</h2>
              <span className={styles.lastUpdated}>
                Last updated December 01, 2020
              </span>

              <p>
                We at Tabbied respect the privacy of your personal information
                and, as such, make every effort to ensure your information is
                protected and remains private. As the owner and operator of
                tabbied.com (the "Website") hereafter referred to in this
                Privacy Policy as "Tabbied", "us", "our" or "we", we have
                provided this Privacy Policy to explain how we collect, use,
                share and protect information about the users of our Website
                (hereafter referred to as "user", "you" or "your"). For the
                purposes of this Agreement, any use of the terms "Tabbied",
                "us", "our" or "we" includes Tabbied, without limitation. We
                will not use or share your personal information with anyone
                except as described in this Privacy Policy.
              </p>

              <p>
                This Privacy Policy will inform you about the types of personal
                data we collect, the purposes for which we use the data, the
                ways in which the data is handled and your rights with regard to
                your personal data. Furthermore, this Privacy Policy is intended
                to satisfy the obligation of transparency under the EU General
                Data Protection Regulation 2016/679 ("GDPR") and the laws
                implementing GDPR.
              </p>

              <p>
                For the purpose of this Privacy Policy the Data Controller of
                personal data is Tabbied and our contact details are set out in
                the Contact section at the end of this Privacy Policy. Data
                Controller means the natural or legal person who (either alone
                or jointly or in common with other persons) determines the
                purposes for which and the manner in which any personal
                information are, or are to be, processed.
              </p>

              <p>
                For purposes of this Privacy Policy, "Your Information" or
                "Personal Data" means information about you, which may be of a
                confidential or sensitive nature and may include personally
                identifiable information ("PII") and/or financial information.
                PII means individually identifiable information that would allow
                us to determine the actual identity of a specific living person,
                while sensitive data may include information, comments, content
                and other information that you voluntarily provide.
              </p>

              <p>
                Tabbied collects information about you when you use our Website
                to access our services, and other online products and services
                (collectively, the "Services") and through other interactions
                and communications you have with us. The term Services includes,
                collectively, various applications, websites, widgets, email
                notifications and other mediums, or portions of such mediums,
                through which you have accessed this Privacy Policy.
              </p>

              <p>
                We may change this Privacy Policy from time to time. If we
                decide to change this Privacy Policy, we will inform you by
                posting the revised Privacy Policy on the Site. Those changes
                will go into effect on the "Last updated" date shown at the end
                of this Privacy Policy. By continuing to use the Site or
                Services, you consent to the revised Privacy Policy. We
                encourage you to periodically review the Privacy Policy for the
                latest information on our privacy practices.
              </p>

              <p>
                BY ACCESSING OR USING OUR SERVICES, YOU CONSENT TO THE
                COLLECTION, TRANSFER, MANIPULATION, STORAGE, DISCLOSURE AND
                OTHER USES OF YOUR INFORMATION (COLLECTIVELY, "USE OF YOUR
                INFORMATION") AS DESCRIBED IN THIS PRIVACY POLICY. IF YOU DO NOT
                AGREE WITH OR CONSENT TO THIS PRIVACY POLICY YOU MAY NOT ACCESS
                OR USE OUR SERVICES.
              </p>

              <h3>Children's Privacy</h3>
              <p>
                Tabbied does not knowingly collect personally identifiable
                information (PII) from persons under the age of 13. If you are
                under the age of 13, please do not provide us with information
                of any kind whatsoever. If you have reason to believe that we
                may have accidentally received information from a child under
                the age of 13, please contact us immediately at
                support@tabbied.com. If we become aware that we have
                inadvertently received Personal Information from a person under
                the age of 13, we will delete such information from our records.
              </p>

              <h3>Information Provided Directly By You</h3>
              <p>
                We collect information you provide directly to us, such as when
                you request information, create or modify your personal account,
                request Services, subscribe to our Services, complete a Tabbied
                form, survey, quiz or application, contact customer support,
                join or enroll for an event or otherwise communicate with us in
                any manner. This information may include, without limitation:
                name, date of birth, e-mail address, physical address, business
                address, phone number, or any other personal information you
                choose to provide.
              </p>

              <h3>Information Collected Through Your Use of Our Services</h3>
              <p>
                The following are situations in which you may provide Your
                Information to us:
              </p>
              <ul>
                <li>When you fill out forms or fields through our Services;</li>

                <li>When you register for an account with our Service;</li>

                <li>
                  When you create a subscription for our newsletter or Services;
                </li>

                <li>When you provide responses to a survey;</li>

                <li>When you answer questions on a quiz;</li>

                <li>
                  When you join or enroll in an event through our Services;
                </li>

                <li>
                  When you order services or products from, or through our
                  Service;
                </li>

                <li>
                  When you provide information to us through a third-party
                  application, service or Website;
                </li>

                <li>
                  When you communicate with us or request information about us
                  or our products or Services, whether via email or other means;
                  and
                </li>

                <li>
                  When you participate in any of our marketing initiatives,
                  including, contests, events, or promotions.
                </li>
              </ul>

              <p>
                We also automatically collect information via the Website
                through the use of various technologies, including, but not
                limited to Cookies and Web Beacons (explained below). We may
                collect your IP address, browsing behavior and device IDs. This
                information is used by us in order to enable us to better
                understand how our Services are being used by visitors and
                allows us to administer and customize the Services to improve
                your overall experience.
              </p>

              <h3>Information Collected From Other Sources</h3>
              <p>
                We may also receive information from other sources and combine
                that with information we collect through our Services. For
                example if you choose to link, create, or log in to your Tabbied
                account with a social media service, e.g. LinkedIn, Facebook or
                Twitter, or if you engage with a separate App or Website that
                uses our API, or whose API we use, we may receive information
                about you or your connections from that Site or App. This
                includes, without limitation, profile information, profile
                picture, gender, user name, user ID associated with your social
                media account, age range, language, country, friends list, and
                any other information you permit the social network to share
                with third parties. The data we receive is solely dependent upon
                your privacy settings with the social network.
              </p>

              <h3>Information Third Parties Provide</h3>
              <p>
                We may collect information about you from sources other than
                you, such as from social media websites (i.e., Facebook,
                LinkedIn, Twitter or others), blogs, analytics providers,
                business affiliates and partners and other users. This includes,
                without limitation, identity data, contact data, marketing and
                communications data, behavioral data, technical data and content
                data.
              </p>

              <h3>Aggregated Data</h3>
              <p>
                We may collect, use and share Aggregated Data such as
                statistical or demographic data for any purpose. Aggregated Data
                is de-identified or anonymized and does not constitute Personal
                Data for the purposes of the GDPR as this data does not directly
                or indirectly reveal your identity. If we ever combine
                Aggregated Data with your Personal Data so that it can directly
                or indirectly identify you, we treat the combined data as PII
                which will only be used in accordance with this Privacy Policy.
              </p>

              <h3>Cookies, Log Files and Anonymous Identifiers</h3>
              <p>
                When you visit our Services, we may send one or more Cookies –
                small data files – to your computer to uniquely identify your
                browser and let us help you log in faster and enhance your
                navigation through the Sites. "Cookies" are text-only pieces of
                information that a website transfers to an individual’s hard
                drive or other website browsing equipment for record keeping
                purposes. A Cookie may convey anonymous information about how
                you browse the Services to us so we can provide you with a more
                personalized experience, but does not collect personal
                information about you. Cookies allow the Sites to remember
                important information that will make your use of the site more
                convenient. A Cookie will typically contain the name of the
                domain from which the Cookie has come, the "lifetime" of the
                Cookie, and a randomly generated unique number or other value.
                Certain Cookies may be used on the Sites regardless of whether
                you are logged in to your account or not.
              </p>

              <p>
                Session Cookies are temporary Cookies that remain in the Cookie
                file of your browser until you leave the Site.
              </p>

              <p>
                Persistent Cookies remain in the Cookie file of your browser for
                much longer (though how long will depend on the lifetime of the
                specific Cookie).
              </p>

              <p>
                When we use session Cookies to track the total number of
                visitors to our Site, this is done on an anonymous aggregate
                basis (as Cookies do not in themselves carry any personal data).
              </p>

              <p>
                We may also employ Cookies so that we remember your computer
                when it is used to return to the Site to help customize your
                Tabbied web experience. We may associate personal information
                with a Cookie file in those instances.
              </p>

              <p>
                We use Cookies to help us know that you are logged on, provide
                you with features based on your preferences, understand when you
                are interacting with our Services, and compile other information
                regarding use of our Services.
              </p>

              <p>
                Third parties with whom we partner to provide certain features
                on our Site or to display advertising based upon your Web
                browsing activity use Cookies to collect and store information.
              </p>

              <p>
                Our Website may use remarketing services, to serve ads on our
                behalf across the internet on third party websites to previous
                visitors to our Sites. It could mean that we advertise to
                previous visitors who haven’t completed a task on our site. This
                could be in the form of an advertisement on the Google search
                results page or a site in the Google Display Network.
                Third-party vendors, including Google, use Cookies to serve ads
                based on your past visits to our Website. Any data collected
                will be used in accordance with our own privacy policy, as well
                as Google's privacy policies. To learn more, or to opt-out of
                receiving advertisements tailored to your interests by our third
                parties, visit the Network Advertising Initiative at
                www.networkadvertising.org/choices.
              </p>

              <p>
                Tabbied may use third-party services such as Google Analytics to
                help understand use of the Services. These services typically
                collect the information sent by your browser as part of a web
                page request, including Cookies and your IP address. They
                receive this information and their use of it is governed by
                their respective privacy policies. You may opt-out of Google
                Analytics for Display Advertisers including AdWords and opt-out
                of customized Google Display Network ads by visiting the Google
                Ads Preferences Manager here . To provide website visitors more
                choice on how their data is collected by Google Analytics,
                Google has developed an Opt-out Browser add-on, which is
                available by visiting Google Analytics Opt-out Browser Add-on
                here.
              </p>

              <p>
                You can control the use of Cookies at the individual browser
                level. Use the options in your web browser if you do not wish to
                receive a Cookie or if you wish to set your browser to notify
                you when you receive a Cookie. You can easily delete and manage
                any Cookies that have been installed in the Cookie folder of
                your browser by following the instructions provided by your
                particular browser manufacturer. Consult the documentation that
                your particular browser manufacturer provides. You may also
                consult your mobile device documentation for information on how
                to disable Cookies on your mobile device. If you reject Cookies,
                you may still use our Website, but your ability to use some
                features or areas of our Service may be limited.
              </p>

              <p>
                Tabbied cannot control the use of Cookies by third parties (or
                the resulting information), and use of third party Cookies is
                not covered by this policy.
              </p>

              <p>
                We automatically collect information about how you interact with
                our Services, preferences expressed, and settings chosen and
                store it in Log Files. This information may include internet
                protocol (IP) addresses, browser type, internet service provider
                (ISP), referring/exit pages, operating system, date/time stamp,
                and/or clickstream data. We may combine this automatically
                collected log information with other information we collect
                about you. We do this to improve services we offer you, to
                improve marketing, analytics, or Website functionality, and to
                document your consent to receiving products, services or
                communications from us or our partners. If we link such
                information with personally identifiable information in a manner
                that identifies a particular individual, then we will treat all
                such information as PII for purposes of this Privacy Policy.
              </p>

              <p>
                When you use our Services, we may employ Web Beacons (also known
                as clear GIFs or tracking pixels) to anonymously track online
                usage patterns. No Personally Identifiable Information from your
                account is collected using these Web Beacons.
              </p>

              <h3>Device Information</h3>
              <p>
                When you use our Services through your computer, mobile phone or
                other device, we may collect information regarding and related
                to your device, such as hardware models and IDs, device type,
                operating system version, the request type, the content of your
                request and basic usage information about your use of our
                Services, such as date and time. We may also collect and store
                information locally on your device using mechanisms such as
                browser web storage and application data caches.
              </p>

              <h3>Location Information</h3>
              <p>
                When you use the Services we may collect your precise location
                data. We may also derive your approximate location from your IP
                address.
              </p>

              <h3>Protective Measures We Use</h3>
              <p>
                We protect your information using commercially reasonable
                technical and administrative security measures to reduce the
                risks of loss, misuse, unauthorized access, disclosure and
                alteration. Although we take measures to secure your
                information, we do not promise, and you should not expect, that
                your personal information, or searches, or other information
                will always remain secure. We cannot guarantee the security of
                our information storage, nor can we guarantee that the
                information you supply will not be intercepted while being
                transmitted to and from us over the Internet including, without
                limitation, email and text transmissions. In the event that any
                information under our control is compromised as a result of a
                breach of security, we will take reasonable steps to investigate
                the situation and where appropriate, notify those individuals
                whose information may have been compromised and take other
                steps, in accordance with any applicable laws and regulations.
              </p>

              <h3>
                The Legal Basis For Collection and Processing of Your Personal
                Information
              </h3>
              <p>
                The legal basis upon which we rely for the collection and
                processing of your Personal Information under the GDPR are the
                following:
              </p>

              <ul>
                <li>
                  When signing up subscribing to use our Services, you have
                  given us explicit consent allowing Tabbied to provide you with
                  our Services and generally to process your information in
                  accordance with this Privacy Policy; and to the transfer of
                  your personal data to other jurisdictions including, without
                  limitation, the United States;
                </li>

                <li>
                  It is necessary registering you as a user, managing your
                  account and profile, and authenticating you when you log in.
                </li>

                <li>
                  It is necessary for our legitimate interests in the proper
                  administration of our website and business; analyzing the use
                  of the website and our Services; assuring the security of our
                  website and Services; maintaining back-ups of our databases;
                  and communicating with you;
                </li>

                <li>
                  To resolve technical issues you encounter, to respond to your
                  requests for assistance, comments and questions, to analyze
                  crash information, to repair and improve the Services and
                  provide other customer support.
                </li>

                <li>
                  To send communications via email and within the Services,
                  including, for example, responding to your comments, questions
                  and requests, providing customer support, and sending you
                  technical notices, product updates, security alerts, and
                  administrative and account management related messages.
                </li>

                <li>
                  To send promotional communications that may be of specific
                  interest to you.
                </li>

                <li>
                  It is necessary for our legitimate interests in the protection
                  and assertion of our legal rights, and the legal rights of
                  others, including you;
                </li>

                <li>
                  It is necessary for our compliance with certain legal
                  provisions which may require us to process your personal data.
                  By way of example, and without limitation, we may be required
                  by law to disclose your personal data to law enforcement or a
                  regulatory agency.
                </li>
              </ul>

              <p>
                Our primary purpose in collecting, holding, using and disclosing
                your Information is for our legitimate business purposes and to
                provide you with a safe, smooth, efficient, and customized
                experience.
              </p>

              <p>We will use this information in order to:</p>
              <ul>
                <li>
                  Provide users with our Services and customer support
                  including, but not limited to, confirming emails related to
                  our services, reminders, confirmations, requests for
                  information and transactions.
                </li>

                <li>Contact you and provide you with information.</li>

                <li>
                  Analyze, improve and manage our Services and operations.
                </li>

                <li>
                  Resolve problems and disputes, and engage in other legal and
                  security matters.
                </li>

                <li>
                  Enforce any terms and conditions of any subscription for our
                  Services.
                </li>
              </ul>
              <p>
                Additionally, we may use the information we collect about you
                to:
              </p>
              <ul>
                <li>
                  Send you communications we think will be of interest to you,
                  including information about products, services, promotions,
                  news, and events of Tabbied and other affiliated or sponsoring
                  companies with whom we have established a relationship.
                </li>

                <li>
                  Display advertising, including advertising that is targeted to
                  you or other users based on your location, interests, as well
                  as your activities on our Services.
                </li>

                <li>
                  Verify your identity and prevent impersonation, spam or other
                  unauthorized or illegal activity.
                </li>

                <li>
                  We may transfer the information described in this Privacy
                  Policy to, and process and store it in, the United States and
                  other countries, some of which may have less protective data
                  protection laws than the region in which you reside. Where
                  this is the case, we will take appropriate measures to protect
                  your personal information in accordance with this Privacy
                  Policy.
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
    </>
  );
}
