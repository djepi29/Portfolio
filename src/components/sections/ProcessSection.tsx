'use client'

import { useState, useEffect, useRef } from 'react'

const processSteps = [
  {
    step: '01',
    title: 'Discovery & Planning',
    description: 'We conduct comprehensive research and analysis to understand your business objectives, target market, and specific requirements. This includes competitor analysis, user persona development, and technical feasibility assessment to create a detailed project roadmap that aligns with your business goals and budget.',
    icon: '🔍'
  },
  {
    step: '02', 
    title: 'Design & Prototyping',
    description: 'I create professional wireframes, mockups, and interactive prototypes that reflect your brand identity and optimize user experience. This includes responsive design for all devices, accessibility considerations, and user interface elements that drive conversions and engagement.',
    icon: '🎨'
  },
  {
    step: '03',
    title: 'Development & Testing',
    description: 'Your project is built using cutting-edge web technologies including React, Next.js, and modern frameworks. I implement rigorous testing protocols, performance optimization, security measures, and cross-browser compatibility to ensure your application runs flawlessly.',
    icon: '⚡'
  },
  {
    step: '04',
    title: 'Launch & Support',
    description: 'We deploy your project to production with proper hosting, domain setup, and SEO optimization. I provide comprehensive training, documentation, and ongoing technical support to ensure your digital solution continues to grow and evolve with your business needs.',
    icon: '🚀'
  }
]

const solutions = [
  {
    title: 'Learning Apps',
    description: 'PDF to audio conversion, quiz generation, study tools',
    details: [
      'PDF to audio conversion',
      'Quiz generation',
      'Study tools',
      'Progress tracking',
      'Interactive lessons',
      'Don\'t see what you need? Let\'s discuss your specific requirements.'
    ],
    icon: '📚',
  },
  {
    title: 'Business Tools',
    description: 'Appointment booking, inventory management, finance tracking',
    details: [
      'Appointment booking',
      'Inventory management',
      'Finance tracking',
      'Customer management',
      'Analytics dashboard',
      'Need something different? I can build custom tools for your business.'
    ],
    icon: '💼',
  },
  {
    title: 'Professional Platforms',
    description: 'Fitness coach tools, contractor management, legal practice tools',
    details: [
      'Fitness coach tools',
      'Contractor management',
      'Legal practice tools',
      'Client portals',
      'Document management',
      'Have a unique need? Let\'s create a solution tailored to your practice.'
    ],
    icon: '👨‍💼',
  },
  {
    title: 'Health & Wellness',
    description: 'Health tracking hub, nutrition planning, mental health tools',
    details: [
      'Health tracking hub',
      'Nutrition planning',
      'Mental health tools',
      'Appointment scheduling',
      'Progress monitoring',
      'Looking for something specific? I can develop custom health solutions.'
    ],
    icon: '🏥',
  },
  {
    title: 'Dynamic Websites',
    description: 'Custom websites, e-commerce platforms, community sites',
    details: [
      'Custom websites',
      'E-commerce platforms',
      'Community sites',
      'Content management',
      'SEO optimization',
      'Need a unique website? Let\'s discuss your vision and make it reality.'
    ],
    icon: '🌐',
  },
  {
    title: 'Custom Solutions',
    description: 'Tailored applications for your specific business needs',
    details: [
      'Tailored applications',
      'Custom integrations',
      'API development',
      'Database design',
      'Scalable architecture',
      'Have a complex project? I specialize in bringing unique ideas to life.'
    ],
    icon: '⚙️',
  }
]

const strugglePoints = [
  {
    icon: '⏰',
    title: 'Wasted Time',
    shortDescription: 'Learning curves, debugging, and endless tweaking',
    verboseDescription: 'Many business owners spend countless hours learning complex web development frameworks, debugging code errors, and endlessly tweaking designs that never quite work as intended. This time could be better spent growing your business, serving customers, or developing new products. The opportunity cost of DIY web development often exceeds the initial savings, as valuable business hours are consumed by technical challenges that could be handled efficiently by a professional developer.'
  },
  {
    icon: '💰',
    title: 'Hidden Costs',
    shortDescription: 'Premium features, plugins, and ongoing subscriptions',
    verboseDescription: 'What starts as a "free" DIY solution quickly becomes expensive with premium plugins, advanced features, hosting upgrades, security add-ons, and ongoing subscription fees. Many business owners discover they need multiple paid tools to achieve the functionality they want, often spending more than a custom solution would cost. These hidden costs accumulate over time, making the "cheap" DIY approach significantly more expensive than initially anticipated.'
  },
  {
    icon: '😤',
    title: 'Frustration',
    shortDescription: 'Technical limitations and lack of customization',
    verboseDescription: 'DIY platforms often have rigid templates and limited customization options that prevent you from achieving your unique vision. Business owners frequently encounter frustrating technical limitations, compatibility issues, and the inability to implement specific features their business requires. This leads to compromised designs, reduced functionality, and a final product that doesn\'t truly represent your brand or meet your business needs.'
  },
  {
    icon: '📉',
    title: 'Poor Results',
    shortDescription: 'Generic solutions that don\'t fit your business needs',
    verboseDescription: 'Template-based solutions often result in generic-looking websites that fail to differentiate your business from competitors. These cookie-cutter designs lack the professional polish and custom functionality needed to effectively convert visitors into customers. Poor user experience, slow loading times, and lack of mobile optimization can significantly impact your search engine rankings and customer engagement, ultimately hurting your bottom line.'
  }
]

export default function ProcessSection() {
  const [selectedSolution, setSelectedSolution] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [rocketLaunched, setRocketLaunched] = useState(false)
  const [showSupportIcon, setShowSupportIcon] = useState(false)
  const [isScrolling, setIsScrolling] = useState(true)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [hoveredStruggle, setHoveredStruggle] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Intersection Observer to trigger animations when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
          // Start step 1 animation immediately
          setCurrentStep(1)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  // Sequential animation timing
  useEffect(() => {
    if (!isVisible) return

    const timers = [
      setTimeout(() => setCurrentStep(2), 3000), // Step 2 after 3s
      setTimeout(() => setCurrentStep(3), 5500), // Step 3 after 5.5s (3s + 2.5s)
      setTimeout(() => setCurrentStep(4), 7500), // Step 4 after 7.5s (3s + 2.5s + 2s)
    ]

    return () => timers.forEach(clearTimeout)
  }, [isVisible])

  // Handle rocket launch with delay
  const handleRocketLaunch = () => {
    setRocketLaunched(true)
    // Show support icon after 2.2 seconds (2s animation + 0.2s delay)
    setTimeout(() => {
      setShowSupportIcon(true)
    }, 2200)
  }

  // Auto-scroll functionality
  useEffect(() => {
    if (!isScrolling || !scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const scrollWidth = container.scrollWidth
    const clientWidth = container.clientWidth
    const maxScroll = scrollWidth - clientWidth

    let scrollPosition = 0
    const scrollSpeed = 0.5 // pixels per frame
    let animationId: number

    const scroll = () => {
      if (!isScrolling) {
        if (animationId) {
          cancelAnimationFrame(animationId)
        }
        return
      }

      scrollPosition += scrollSpeed
      
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0 // Reset to beginning for seamless loop
      }

      container.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(scroll)
    }

    animationId = requestAnimationFrame(scroll)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isScrolling])

  // Handle card hover
  const handleCardHover = (index: number | null) => {
    setHoveredCard(index)
    setIsScrolling(index === null) // Pause scrolling when hovering
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        {/* Process Overview */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            How Your Project Gets Built
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Every successful project follows a structured approach. This proven methodology ensures your vision becomes reality, 
            your goals are met, and your business gets the digital tools it needs to thrive and grow in today's competitive market.
          </p>
        </div>

        {/* Process Steps - Curved Layout */}
        <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {processSteps.map((step, index) => {
            // Create curved positioning for desktop view
            const curvedClasses = index === 1 || index === 2 ? 'lg:mt-9' : ''
            
            // Apply different animations based on current step and visibility
            let animationClasses = ''
            if (index === 0 && currentStep >= 1) {
              // Step 1: 2 rotations, slowest
              animationClasses = 'step1-rotate'
            } else if (index === 1 && currentStep >= 2) {
              // Step 2: 3 rotations, medium speed
              animationClasses = 'step2-rotate'
            } else if (index === 2 && currentStep >= 3) {
              // Step 3: 4 rotations, fastest
              animationClasses = 'step3-rotate'
            } else if (index === 3 && currentStep >= 4) {
              // Step 4: Shaking + lift-off hover (starts after step 3 completes)
              animationClasses = rocketLaunched ? '' : 'process-shake-test'
            }
            
            // Debug: Add border to step 4 when it should be shaking
            if (index === 3 && currentStep >= 4) {
              animationClasses += ' border-2 border-red-500'
            }
            
            return (
              <div key={index} className={`text-center ${curvedClasses}`}>
                <div 
                  className={`bg-primary-100 w-28 h-28 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 ${animationClasses.replace('process-lift-off', '')}`}
                >
                  {index === 3 && currentStep >= 4 ? (
                    showSupportIcon ? (
                      <span>🛡️</span> // Support/Monitoring icon
                    ) : (
                      <span 
                        className={rocketLaunched ? "rocket-launched" : "process-lift-off"}
                        onMouseEnter={!rocketLaunched ? handleRocketLaunch : undefined}
                      >
                        {step.icon}
                      </span>
                    )
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="text-primary-600 font-bold text-sm mb-3">STEP {step.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            )
          })}
        </div>

        {/* Solutions Preview */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            Solutions That Scale
          </h3>
          
          {/* Auto-scrolling Solutions Carousel */}
          <div className="relative">
            <div 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
              style={{ scrollBehavior: 'auto' }}
              onMouseEnter={() => setIsScrolling(false)}
              onMouseLeave={() => setIsScrolling(true)}
            >
              {solutions.map((solution, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-80 bg-white border border-gray-200 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                    hoveredCard === index 
                      ? 'scale-110 shadow-xl' 
                      : 'hover:shadow-lg'
                  }`}
                  onMouseEnter={() => handleCardHover(index)}
                  onMouseLeave={() => handleCardHover(null)}
                >
                  <div className={`text-4xl mb-4 transition-all duration-300 ${
                    hoveredCard === index 
                      ? 'text-6xl flex justify-center' 
                      : ''
                  }`}>
                    {solution.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{solution.title}</h4>
                  
                  {/* Content area that changes on hover */}
                  <div className="min-h-[60px] flex items-center justify-center">
                    {hoveredCard === index ? (
                      <div className="space-y-1 text-left w-full">
                        {solution.details.map((detail, detailIndex) => {
                          const isLastItem = detailIndex === solution.details.length - 1
                          return (
                            <div key={detailIndex} className={`text-sm flex items-center ${
                              isLastItem 
                                ? 'text-primary-600 font-medium mt-2 pt-2 border-t border-gray-200' 
                                : 'text-gray-600'
                            }`}>
                              {!isLastItem && <span className="mr-2">-</span>}
                              <span>{detail}</span>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="bounce-arrow text-2xl text-gray-400">
                        ↓
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Struggle Section */}
        <div className="bg-red-50 rounded-2xl p-8 md:p-12">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              The Hidden Costs of DIY Solutions
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Many business owners try to build their own websites and tools using AI, templates, or DIY platforms. 
              While this might seem cost-effective initially, it often leads to:
            </p>
            
            <div className="flex gap-4 justify-center items-stretch">
              {strugglePoints.map((struggle, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg p-6 cursor-pointer transition-all duration-500 ease-in-out ${
                    hoveredStruggle === index
                      ? 'flex-[2] min-w-[400px]'
                      : hoveredStruggle !== null
                      ? 'flex-[0.5] min-w-[120px] opacity-70'
                      : 'flex-1 min-w-[200px]'
                  }`}
                  onMouseEnter={() => setHoveredStruggle(index)}
                  onMouseLeave={() => setHoveredStruggle(null)}
                >
                  <div className={`text-red-500 mb-3 transition-all duration-300 ${
                    hoveredStruggle === index ? 'text-4xl' : 'text-2xl'
                  }`}>
                    {struggle.icon}
                  </div>
                  <h4 className={`font-semibold text-gray-900 mb-2 transition-all duration-300 ${
                    hoveredStruggle === index ? 'text-xl' : 'text-base'
                  }`}>
                    {struggle.title}
                  </h4>
                  <div className={`transition-all duration-300 ${
                    hoveredStruggle === index ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
                  }`}>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {struggle.verboseDescription}
                    </p>
                  </div>
                  <div className={`transition-all duration-300 ${
                    hoveredStruggle === index ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
                  }`}>
                    <p className="text-gray-600 text-sm">
                      {struggle.shortDescription}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-lg text-gray-700 font-medium mt-8">
              Don't let these roadblocks prevent you from having the professional solution your business deserves.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
