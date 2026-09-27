(function () {
  'use strict';

  /* ---------------------------------------------------------------
   * Product catalogue
   * Display order set explicitly, per spec. Each product can define
   * `extraFields` — product-specific questions asked in the order
   * wizard in addition to name / date of birth / contact number.
   * ------------------------------------------------------------- */
  var PRODUCTS = [
    {
      id: 'quick-insight',
      name: 'Quick numerology insight',
      price: 599,
      desc: 'A fast, single-page snapshot of your core numbers.',
      includes: [
        { type: 'p', text: 'You will receive:' },
        { type: 'ul', items: [
          'Driver, Conductor & Kua analysis',
          'Lo Shu Grid analysis',
          'Lucky & less favourable numbers',
          'Lucky colours',
          'Short practical advice'
        ] }
      ],
      extraFields: []
    },
    {
      id: 'basic-report',
      name: 'Basic numerology report',
      price: 999,
      desc: 'Your core numbers explained life path, destiny, and soul urge.',
      includes: [
        { type: 'p', text: 'Includes everything in Quick Numerology Insight, plus:' },
        { type: 'ul', items: [
          'Repeating & missing number analysis',
          'Planes analysis',
          'Strengths & development analysis',
          'Career directions',
          '3-year future predictions'
        ] }
      ],
      extraFields: []
    },
    {
      id: 'student-insight',
      name: 'Student numerology insight report',
      price: 790,
      desc: 'Numerology guidance focused on studies, focus, and career direction.',
      includes: [
        { type: 'p', text: 'Explore the student’s natural strengths, development areas, education and career direction, with personalised practical guidance and 3-year future predictions.' }
      ],
      extraFields: [
        { id: 'studyFocus', label: 'What would you like guidance on? (studies, exams, career choice…)', type: 'text', placeholder: 'e.g. choosing between science and commerce' }
      ]
    },
    {
      id: 'premium-report',
      name: 'Premium numerology report',
      price: 2100,
      desc: 'An in-depth report covering all core numbers, compatibility, and a yearly forecast.',
      includes: [
        { type: 'p', text: 'Your complete numerology picture.' },
        { type: 'p', text: 'Includes everything in the Basic Report, plus:' },
        { type: 'ul', items: [
          'Mobile number compatibility',
          'Name analysis',
          'Numerology-based remedies'
        ] },
        { type: 'note', text: 'Name correction is not included.' }
      ],
      extraFields: []
    },
    {
      id: 'consultation',
      name: 'Numerology consultation',
      price: 2000,
      desc: 'A one-on-one session to walk through your numbers and get your questions answered.',
      includes: [
        { type: 'p', text: 'Get personalised numerology guidance on the areas that matter to you.' },
        { type: 'meta', text: 'Up to 3 questions • Personalised consultation' },
        { type: 'p', text: 'Questions may relate to areas such as career, name, future or other numerology concerns.' }
      ],
      extraFields: [
        { id: 'consultTopic', label: 'What would you like to focus on in your session?', type: 'text', placeholder: 'e.g. career direction, a big decision' }
      ]
    },
    {
      id: 'name-correction',
      name: 'Name correction analysis',
      price: 3000,
      desc: "A review of your current name's numerology value, with suggested corrections.",
      includes: [
        { type: 'p', text: 'Get a personalised analysis of your name and understand its numerological compatibility, along with guidance on suitable name correction.' }
      ],
      extraFields: [
        { id: 'currentName', label: 'Your current full name (as per your documents)', type: 'text', placeholder: 'Full legal name' }
      ]
    },
    {
      id: 'mobile-compat',
      name: 'Mobile number compatibility & suggestions',
      price: 399,
      desc: 'See how your mobile number aligns with your energy, with suggested changes.',
      includes: [
        { type: 'p', text: 'Check the compatibility of your mobile number with your numerological profile and receive suitable number suggestions.' }
      ],
      extraFields: [
        { id: 'currentMobile', label: 'Your current mobile number', type: 'tel', placeholder: 'e.g. 98765 43210' }
      ]
    }
  ];

  var FAQS = [
    {
      q: 'Is the numerology report personalised?',
      a: 'Yes. Every report is individually analysed and prepared based on the details you provide. It is a customised, handmade report prepared specifically for you.'
    },
    {
      q: 'Which report should I choose?',
      a: 'Choose Quick Numerology Insight (₹599) for a concise overview. Choose the Basic Numerology Report (₹999) for a more detailed analysis covering strengths, development areas, career directions and 3-year predictions. Choose the Premium Numerology Report (₹2,100) for a more comprehensive analysis including name analysis, mobile number compatibility and numerology-based remedies.'
    },
    {
      q: 'What is the Student Insights Numerology Report?',
      a: "It is a specialised report designed for students and parents, covering the student's strengths, development areas, education and career direction, along with practical guidance and 3-year future predictions."
    },
    {
      q: 'Can I see a sample report before ordering?',
      a: 'Yes. It is  available in website.'
    },
    {
      q: 'What information do I need to provide?',
      a: 'The information required depends on the service you select. You will be guided through the details required after placing your order.'
    },
    {
      q: 'How will I receive my report?',
      a: 'Your customised report will be delivered digitally in PDF format.'
    },
    {
      q: 'How long does it take to receive my report?',
      a: 'Since every report is customised and prepared by hand, it will be delivered within 3 working days after receiving the required information and payment.'
    },
    {
      q: 'Can I share any specific concern or issue?',
      a: 'Yes. If you have a particular concern, question or issue you would like considered in your analysis, you may optionally share it before making the payment. This can help us understand what you are looking for.'
    }
  ];

  function formatPrice(n) {
    return '₹' + n.toLocaleString('en-IN');
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------------------------------------------------------------
   * Render product cards
   * Only FEATURED_IDS show up front; the rest reveal on "Show more".
   * ------------------------------------------------------------- */
  var FEATURED_IDS = ['basic-report', 'student-insight', 'premium-report'];

  function productCardHtml(p, isExtra) {
    return (
      '<div class="product-card' + (isExtra ? ' product-card--extra' : '') + '">' +
        '<div class="product-card-top">' +
          '<span class="product-name">' + p.name + '</span>' +
          '<span class="product-price">' + formatPrice(p.price) + '</span>' +
        '</div>' +
        '<p class="product-desc">' + p.desc + '</p>' +
        '<div class="product-actions">' +
          '<button class="btn btn-secondary" data-info="' + p.id + '">What\'s included</button>' +
          '<button class="btn btn-primary" data-buy="' + p.id + '">Buy now</button>' +
        '</div>' +
      '</div>'
    );
  }

  function renderProducts() {
    var grid = document.getElementById('productGrid');
    var moreWrap = document.getElementById('productsMore');
    var showMoreBtn = document.getElementById('showMoreProducts');

    var featured = FEATURED_IDS
      .map(function (id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; })
      .filter(Boolean);
    var rest = PRODUCTS.filter(function (p) { return FEATURED_IDS.indexOf(p.id) === -1; });

    grid.innerHTML =
      featured.map(function (p) { return productCardHtml(p, false); }).join('') +
      rest.map(function (p) { return productCardHtml(p, true); }).join('');

    if (rest.length && showMoreBtn) {
      showMoreBtn.addEventListener('click', function () {
        var expanded = grid.classList.toggle('is-expanded');
        showMoreBtn.textContent = expanded ? 'Show less' : 'Show more reports';
        showMoreBtn.setAttribute('aria-expanded', String(expanded));
        if (!expanded) {
          grid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    } else if (moreWrap) {
      moreWrap.remove();
    }

    grid.addEventListener('click', function (e) {
      var buyBtn = e.target.closest('[data-buy]');
      if (buyBtn) {
        var product = PRODUCTS.filter(function (p) { return p.id === buyBtn.getAttribute('data-buy'); })[0];
        if (product) openOrderModal(product);
        return;
      }
      var infoBtn = e.target.closest('[data-info]');
      if (infoBtn) {
        var infoProduct = PRODUCTS.filter(function (p) { return p.id === infoBtn.getAttribute('data-info'); })[0];
        if (infoProduct) openInfoModal(infoProduct);
      }
    });
  }

  /* ---------------------------------------------------------------
   * Render FAQ accordion
   * ------------------------------------------------------------- */
  function renderFaq() {
    var list = document.getElementById('faqList');
    var html = FAQS.map(function (item, i) {
      return (
        '<div class="faq-item" data-open="false">' +
          '<button class="faq-question" aria-expanded="false" data-faq="' + i + '">' +
            '<span>' + item.q + '</span>' +
            '<span class="faq-icon" aria-hidden="true">+</span>' +
          '</button>' +
          '<div class="faq-answer"><p>' + item.a + '</p></div>' +
        '</div>'
      );
    }).join('');
    list.innerHTML = html;

    list.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-faq]');
      if (!btn) return;
      var item = btn.closest('.faq-item');
      var answer = item.querySelector('.faq-answer');
      var isOpen = item.getAttribute('data-open') === 'true';

      if (isOpen) {
        item.setAttribute('data-open', 'false');
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.setAttribute('data-open', 'true');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  }

  /* ---------------------------------------------------------------
   * Mobile nav toggle
   * ------------------------------------------------------------- */
  function initNav() {
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('main-nav');

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------------------------------------------------------
   * Order wizard (one question per step)
   * ------------------------------------------------------------- */
  var overlay = document.getElementById('modalOverlay');
  var modalBody = document.getElementById('modalBody');
  var modalProgress = document.getElementById('modalProgress');
  var modalClose = document.getElementById('modalClose');

  var wizard = { product: null, steps: [], stepIndex: 0, answers: {} };

  function buildSteps(product) {
    var steps = [
      { id: 'fullName', label: 'What is your full name?', type: 'text', placeholder: 'Full name as given at birth' },
      { id: 'dob', label: 'What is your date of birth?', type: 'date' }
    ];
    steps = steps.concat(product.extraFields);
    steps.push({ id: 'concerns', label: 'Any specific issue/concerns which you want to cover in the report?', type: 'textarea', placeholder: 'Optional share anything specific you\'d like addressed', required: false });
    steps.push({ id: 'contact', label: 'Best contact number (WhatsApp preferred)', type: 'tel', placeholder: 'e.g. 98765 43210' });
    steps.push({ id: 'email', label: 'Email address for delivery', type: 'email', placeholder: 'you@example.com' });
    return steps;
  }

  function openOrderModal(product) {
    wizard.product = product;
    wizard.steps = buildSteps(product);
    wizard.stepIndex = 0;
    wizard.answers = {};
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    renderStep();
  }

  function closeOrderModal() {
    overlay.hidden = true;
    document.body.style.overflow = '';
  }

  function totalSteps() {
    return wizard.steps.length + 1; // + review/confirm step
  }

  function renderProgress() {
    var total = totalSteps();
    var current = wizard.stepIndex;
    var html = '';
    for (var i = 0; i < total; i++) {
      html += '<span class="' + (i <= current ? 'done' : '') + '"></span>';
    }
    modalProgress.innerHTML = html;
  }

  function renderStep() {
    renderProgress();

    if (wizard.stepIndex < wizard.steps.length) {
      renderQuestionStep(wizard.steps[wizard.stepIndex]);
    } else {
      renderReviewStep();
    }
  }

  function renderQuestionStep(step) {
    var isFirst = wizard.stepIndex === 0;
    var existing = escapeHtml(wizard.answers[step.id] || '');
    var placeholder = escapeHtml(step.placeholder || '');
    var inputTag = step.type === 'textarea'
      ? '<textarea id="stepInput" rows="3" placeholder="' + placeholder + '">' + existing + '</textarea>'
      : '<input id="stepInput" type="' + step.type + '" placeholder="' + placeholder + '" value="' + existing + '" />';

    modalBody.innerHTML =
      '<span class="modal-eyebrow">' + wizard.product.name + '</span>' +
      '<h3>' + step.label + '</h3>' +
      '<div class="field" id="stepField">' +
        inputTag +
        (step.required === false ? '<p class="field-hint">Optional leave blank if none</p>' : '') +
        '<p class="field-error">Please fill in this field to continue.</p>' +
      '</div>' +
      '<div class="modal-actions">' +
        (isFirst ? '' : '<button class="btn btn-secondary" id="backBtn">Back</button>') +
        '<button class="btn btn-primary" id="nextBtn">Continue</button>' +
      '</div>';

    var input = document.getElementById('stepInput');
    input.focus();

    document.getElementById('nextBtn').addEventListener('click', function () {
      var value = input.value.trim();
      var field = document.getElementById('stepField');
      if (step.required !== false && !value) {
        field.classList.add('invalid');
        return;
      }
      field.classList.remove('invalid');
      wizard.answers[step.id] = value;
      wizard.stepIndex++;
      renderStep();
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && step.type !== 'textarea') {
        e.preventDefault();
        document.getElementById('nextBtn').click();
      }
    });

    var backBtn = document.getElementById('backBtn');
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        wizard.stepIndex--;
        renderStep();
      });
    }
  }

  function renderReviewStep() {
    var rows = wizard.steps.map(function (step) {
      var display = wizard.answers[step.id] ? escapeHtml(wizard.answers[step.id]) : '—';
      return '<div class="review-row"><dt>' + step.label.replace(/\?$/, '') + '</dt><dd>' + display + '</dd></div>';
    }).join('');

    modalBody.innerHTML =
      '<span class="modal-eyebrow">' + wizard.product.name + '</span>' +
      '<h3>Review your details</h3>' +
      '<p class="field-hint">' + wizard.product.name + ' — ' + formatPrice(wizard.product.price) + '</p>' +
      '<dl class="review-list">' + rows + '</dl>' +
      '<div class="modal-actions">' +
        '<button class="btn btn-secondary" id="backBtn">Back</button>' +
        '<button class="btn btn-primary" id="submitBtn">Submit request</button>' +
      '</div>';

    document.getElementById('backBtn').addEventListener('click', function () {
      wizard.stepIndex--;
      renderStep();
    });

    document.getElementById('submitBtn').addEventListener('click', submitOrder);
  }

  /*
   * Placeholder submit handler.
   * No payment or messaging is wired up yet — this simply confirms
   * receipt in the UI. Swap this for a PhonePe Payment Links (or
   * similar) redirect once a merchant account is set up: build the
   * payment link from wizard.product and wizard.answers and
   * window.location.assign() to it instead of showing the note below.
   */
  function submitOrder() {
    modalBody.innerHTML =
      '<div class="confirm-icon" aria-hidden="true">' +
        '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<path d="M4 12.5l5 5L20 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
      '</div>' +
      '<h3>Thanks your request is noted</h3>' +
      '<p class="confirm-note">This is a placeholder confirmation. Online payment for ' + wizard.product.name + ' (' + formatPrice(wizard.product.price) + ') isn\'t connected yet — we will reach out to arrange payment and delivery.</p>' +
      '<div class="modal-actions"><button class="btn btn-primary btn-block" id="doneBtn">Close</button></div>';

    document.getElementById('doneBtn').addEventListener('click', closeOrderModal);
  }

  function initModal() {
    modalClose.addEventListener('click', closeOrderModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeOrderModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !overlay.hidden) closeOrderModal();
    });
  }

  /* ---------------------------------------------------------------
   * "What's included" info modal
   * ------------------------------------------------------------- */
  var infoOverlay = document.getElementById('infoModalOverlay');
  var infoModalBody = document.getElementById('infoModalBody');
  var infoModalClose = document.getElementById('infoModalClose');

  function renderIncludesBlock(block) {
    if (block.type === 'ul') {
      var items = block.items.map(function (line) {
        return '<li>' + escapeHtml(line) + '</li>';
      }).join('');
      return '<ul class="includes-list">' + items + '</ul>';
    }
    if (block.type === 'meta') {
      return '<p class="includes-meta">' + escapeHtml(block.text) + '</p>';
    }
    if (block.type === 'note') {
      return '<p class="includes-note">' + escapeHtml(block.text) + '</p>';
    }
    return '<p class="includes-text">' + escapeHtml(block.text) + '</p>';
  }

  function openInfoModal(product) {
    var body = product.includes.map(renderIncludesBlock).join('');

    infoModalBody.innerHTML =
      '<span class="modal-eyebrow">' + escapeHtml(product.name) + '</span>' +
      '<h3>What\'s included</h3>' +
      '<p class="field-hint">' + formatPrice(product.price) + '</p>' +
      '<div class="includes-body">' + body + '</div>' +
      '<div class="modal-actions"><button class="btn btn-primary btn-block" id="infoBuyBtn">Buy now</button></div>';

    document.getElementById('infoBuyBtn').addEventListener('click', function () {
      closeInfoModal();
      openOrderModal(product);
    });

    infoOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeInfoModal() {
    infoOverlay.hidden = true;
    document.body.style.overflow = '';
  }

  function initInfoModal() {
    infoModalClose.addEventListener('click', closeInfoModal);
    infoOverlay.addEventListener('click', function (e) {
      if (e.target === infoOverlay) closeInfoModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !infoOverlay.hidden) closeInfoModal();
    });
  }

  /* ---------------------------------------------------------------
   * Init
   * ------------------------------------------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();
  renderProducts();
  renderFaq();
  initNav();
  initModal();
  initInfoModal();
})();
