class App extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            'total_amount' : 1000,
            'amount': '',
            'email' : ''
         }   
    }
    //checks whether we have the information we need to move forward
    async componentDidMount(){
        const result = await axios.get('/total_amount');
        //console.log(result.data[0].total_amount);
        if(result.data[0].total_amount === null) return this.setState({total_amount: 0})
        this.setState({total_amount: result.data[0].total_amount})
    }

    onSubmit = async (event)=>{
        //prevent page from reloading
        event.preventDefault();
        const response = await axios.post('/post_info',{
            email: this.state.email,
            amount : this.state.amount 
        });
        console.log(response);
        window.location.href = response.data;
    }
    render(){
        return(<div>
            <h1>Lottery Application</h1>
            <div>
                <p>Total Lottery Amount is {this.state.total_amount}</p>
            </div>
            <form onSubmit={this.onSubmit}>
                <input placeholder="email" value={this.state.email} 
                onChange={event => this.setState({email: event.target.value})}/>
                <input placeholder="amount"
                onChange={event => this.setState({amount: event.target.value})} />
                <button type="submit">Participate</button>
            </form>
        </div>)
    }
};

ReactDOM.render(
    <div>
        <App />
    </div>
    , document.getElementById('reactBinding'));