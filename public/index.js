class App extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            'total_amount' : 1000,
            'amount': '',
            'email' : ''
         }   
    }

    onSubmit = async (event)=>{
        //prevent page from reloading
        event.preventDefault();
        const response = await axios.post('/post_info',{
            email: this.state.email,
            amount : this.state.amount 
        });
        console.log(response);

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