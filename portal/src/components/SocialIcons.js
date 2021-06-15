const SocialIcons = ({ socialLinks }) => {
  return (
    <>
      <div className="client-information-item social-icons">
        <h6 className="mb-1">Social links:</h6>
        {socialLinks?.facebookLink ? (<a href={socialLinks?.facebookLink} className="fa fa-facebook" target="_blank"></a>) : null}
        {socialLinks?.twitterUrl ? (<a href={socialLinks?.twitterUrl} className="fa fa-twitter" target="_blank"></a>) : null}
        {socialLinks?.linkedInLink ? (<a href={socialLinks?.linkedInLink} className="fa fa-linkedin" target="_blank"></a>) : null}
        {socialLinks?.youtubeLink ? (<a href={socialLinks?.youtubeLink} className="fa fa-youtube" target="_blank"></a>) : null}
        {socialLinks?.instagramLink ? (<a href={socialLinks?.instagramLink} className="fa fa-instagram" target="_blank"></a>) : null}
      </div>
    </>
  )
}
export default SocialIcons;