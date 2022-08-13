var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/pig3629/my_runes.git', // Update to point to your repository
        user: {
            name: 'pig3629', // update to use your name
            email: 'pig3629@gmail.com' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)