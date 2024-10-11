
router.route('/contact')
.get(async (req,res)=> {
        res.sendFile(path.join(__dirname,'../../public/views/public/contact.html'));
});