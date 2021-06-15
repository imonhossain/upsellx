const PricingList = ({ pricingList }) => {
  return (
    <div className="client-information-item">
      <h6 className="mb-1">Pricing</h6>
      <div className="row">
        {
          pricingList.map((item, i) => {
            return (
              <div className="col-md-4" key={i}>
                <a className="card mb-2" href={item.link}>
                  <div className="card-body">
                    <h5>{item?.name}</h5>
                    <span>Amount: {item?.amount}</span>
                    <div>Amount type: {item?.amountType}</div>
                    <span className="small">{item?.title}</span>
                  </div>
                </a>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
export default PricingList;