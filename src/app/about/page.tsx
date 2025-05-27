import React from "react";

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4">About Us</h1>
        <p className="text-xl text-gray-700">
          We aim to provide a reliable platform for early autism detection using
          modern technology, such as image and video analysis, as well as
          personalized questionnaires.
        </p>
      </div>

      {/* Mission Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Our Mission
        </h2>
        <p className="text-lg text-gray-700">
          Autism spectrum disorder (ASD) can be challenging to detect in its
          early stages, but we believe that early intervention is key to
          improving outcomes for children. Our platform leverages
          state-of-the-art machine learning models to analyze images and videos,
          as well as ask insightful questions, to help identify early signs of
          autism.
        </p>
      </section>

      {/* How It Works Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          How It Works
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-medium text-gray-800">
              1. Image & Video Analysis
            </h3>
            <p className="text-lg text-gray-700">
              Using advanced computer vision algorithms, our platform can
              analyze images and videos of children to detect behaviors commonly
              associated with autism.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-medium text-gray-800">
              2. Interactive Questionnaires
            </h3>
            <p className="text-lg text-gray-700">
              Personalized questions tailored to the child’s age and development
              are used to gather additional insights from parents or caregivers,
              improving the accuracy of the detection.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-medium text-gray-800">
              3. Data-Driven Insights
            </h3>
            <p className="text-lg text-gray-700">
              We combine all the data gathered from the analysis to provide
              accurate and insightful results that can help in identifying early
              signs of autism.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Why Choose Us?
        </h2>
        <p className="text-lg text-gray-700">
          Our approach is rooted in scientific research and cutting-edge
          technology. Here are just a few reasons why parents, caregivers, and
          professionals trust our platform:
        </p>
        <ul className="list-disc list-inside mt-4 text-lg text-gray-700">
          <li>
            Accurate detection methods with a combination of machine learning
            and expert-designed questions.
          </li>
          <li>
            Fast and easy-to-use interface for both parents and professionals.
          </li>
          <li>
            Confidential and secure analysis of your child&apos;s information.
          </li>
          <li>
            Comprehensive reports that provide actionable insights for early
            intervention.
          </li>
        </ul>
      </section>

      {/* Call to Action Section */}
      <section className="text-center mt-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Join Us in Supporting Early Autism Detection
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Together, we can help children get the support they need at the
          earliest stage possible.
        </p>
        <a
          href="/signup"
          className="inline-block px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Start Now
        </a>
      </section>
    </div>
  );
};

export default AboutPage;
