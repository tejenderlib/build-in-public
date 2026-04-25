$(document).ready(function () {
    $('.menu-toggler').on('click', function(){
        $(this).toggleClass('open');
        $('.top-nav').toggleClass('open');
    });

    $('.top-nav .nav-link').on('click', function(){
        $('.menu-toggler').toggleClass('open');
        $('.top-nav').toggleClass('open');
    });

    $('nav a[href*="#]').on('click', function(){
        $('html,body').animate({
            scrollTop: $($(this).attr('href')).offset().top-100
        }, 2000);
    });

    $('#up').on('click', function(){
        $('html,body').animate({
            scrollTop: 0 } ,2000);
    });

    AOS.init({
        easing: 'ease',
        duration: 1800
    });

    // ─── BLOG DATA ───────────────────────────────────────────────
    // Two categories:
    //   devjournal  — coding journey, problems, learning, tutorials
    //   invasivemind — personal writing, deep thoughts, raw entries
    //
    // To add a post: add one object to the right array below.
    // tag options (devjournal):  'python' | 'security' | 'cloud' | 'tools'
    // tag options (invasivemind): 'belief' | 'journal' | 'journey' | 'raw'
    // locked: true = coming soon  |  locked: false = live
    // ─────────────────────────────────────────────────────────────
    var blogData = {
        devjournal: [
            { name: 'Phishing Awareness: How to Detect Suspicious Links (Part1)',    tag: 'tools',    date: 'Apr 12 2025', title: 'Building ThreatHunter CLI', href: 'https://medium.com/@invasiveminds/phishing-awareness-what-is-zphisher-and-how-to-detect-suspicious-links-part1-ca004d238b93', locked: true },
            { name: 'gcp-sql-learning-log', tag: 'python',   date: 'Mar 05 2026', title: 'Google Cloud Arcade — My Run',     href: 'https://github.com/tejenderlib/gcp-sql-learning-log', locked: true },
            { name: 'ongoing', tag: 'cloud',    date: 'Feb 18 2026', title: 'Google Cloud Arcade — My Run',       href: '#', locked: true  },
            { name: 'ongoing', tag: 'security', date: 'Jan 20 2026', title: 'Notes from the CDI Internship',      href: '#', locked: true  }
        ],
        invasivemind: [
            { name: 'ongoing',     tag: 'belief',   date: 'Apr 19 2026', title: 'Ethics in Ethical Hacking',          href: '#', locked: true },
            { name: 'ongoing',     tag: 'journey',  date: 'Mar 22 2026', title: 'Trails & Terminals',                 href: '#', locked: true },
            { name: 'ongoing',     tag: 'journal',  date: 'Feb 10 2026', title: 'Why I Broke Linux on Purpose',       href: '#', locked: true  },
            { name: 'ongoing',     tag: 'raw',      date: 'Jan 08 2026', title: 'On Being Self-Taught',               href: '#', locked: true  }
        ]
    };

    var activeBlogTab = 'devjournal';
    var activeBlogView = 'list';

    var lockSVG   = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-locked"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
    var unlockSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-unlocked"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>';

    window.switchBlogTab = function(tab, btn) {
        activeBlogTab = tab;
        $('.blog-tab-btn').removeClass('active');
        $(btn).addClass('active');
        renderBlog(activeBlogView);
    };

    window.switchBlogView = function(v, btn) {
        activeBlogView = v;
        $('.blog-vbtn').removeClass('active');
        $(btn).addClass('active');
        renderBlog(v);
    };

    function renderBlog(v) {
        var c = document.getElementById('blog-content');
        if (!c) return;
        var posts = blogData[activeBlogTab];

        if (v === 'list') {
            var rows = posts.map(function(b) {
                return '<a href="' + (b.locked ? '#' : b.href) + '" class="blog-list-row">' +
                    '<span class="blog-lock">' + (b.locked ? lockSVG : unlockSVG) + '</span>' +
                    '<span class="blog-mod-date">' + b.date + '</span>' +
                    '<span class="blog-fname' + (b.locked ? ' is-locked' : '') + '">' +
                        '<span class="blog-tag-dot ' + b.tag + '"></span>' +
                        b.name +
                        (b.locked ? '<span class="blog-locked-label">locked</span>' : '') +
                    '</span>' +
                '</a>';
            });
            c.innerHTML = '<div class="blog-list-header"><span>status</span><span>modified</span><span>name</span></div>' + rows.join('');

        } else if (v === 'grid') {
            var cards = posts.map(function(b) {
                return '<a href="' + (b.locked ? '#' : b.href) + '" class="blog-gcard' + (b.locked ? ' is-locked' : '') + '">' +
                    '<div class="blog-gcard-lock">' + (b.locked ? lockSVG : unlockSVG) + '</div>' +
                    '<div class="blog-gicon ' + b.tag + '">.md</div>' +
                    '<div class="blog-gname">' + b.title + '</div>' +
                    '<div class="blog-gmeta">' + b.date + '</div>' +
                '</a>';
            });
            c.innerHTML = '<div class="blog-grid-wrap">' + cards.join('') + '</div>';

        } else {
            var cats = {};
            posts.forEach(function(b) {
                if (!cats[b.tag]) cats[b.tag] = [];
                cats[b.tag].push(b);
            });
            var tree = Object.keys(cats).map(function(cat) {
                var items = cats[cat].map(function(b, i, a) {
                    var branch = (i === a.length - 1) ? '└──' : '├──';
                    return '<a href="' + (b.locked ? '#' : b.href) + '" class="blog-tree-item">' +
                        '<span class="blog-tree-branch">' + branch + '</span>' +
                        '<span class="blog-tree-fname' + (b.locked ? ' is-locked' : '') + '">' + b.name + '</span>' +
                        '<span class="blog-tree-lock">' + (b.locked ? lockSVG : unlockSVG) + '</span>' +
                        '<span class="blog-tree-date">' + b.date + '</span>' +
                    '</a>';
                });
                return '<div class="blog-tree-cat ' + cat + '">' +
                    '<div class="blog-tree-cat-head">' + cat + '</div>' +
                    items.join('') +
                '</div>';
            });
            c.innerHTML = '<div class="blog-tree-wrap">' + tree.join('') + '</div>';
        }
    }

    renderBlog('list');

    // ─── VISITOR COUNTER ─────────────────────────────────────────
    fetch('https://api.countapi.xyz/hit/tejenderthakur-portfolio/pageviews')
        .then(function(res){ return res.json(); })
        .then(function(data){
            $('#visit-count').text(data.value.toLocaleString());
        })
        .catch(function(){
            $('#visit-count').text('—');
        });
});