const PostList = ({ postList }) => {
  return (
    <div className="client-information-item">
      <h6 className="mb-1">Blog post</h6>
      <ul className="list-group ">
        {
          postList.map((item, i) => {
            return (
              <li className="list-group-item" key={i}><a className="card-body" href={item?.link}>
                {item?.title}
              </a></li>
            )
          })
        }
      </ul>
    </div>
  )
}
export default PostList;