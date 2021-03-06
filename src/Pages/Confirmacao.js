import React, { Component } from 'react';
import './Confirmacao.css';
import Menu from '../Components/Menu';
import Loading from '../Components/Loading';
import * as emailjs from 'emailjs-com';

class Confirmacao extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            phone: "",
            email: "",
            guests: [],
            formValidation: null,
            loading: false
        };
        
        this.resetState = this.resetState.bind(this);
    }

    resetState () {
        const initialState = {
            name: "",
            phone: "",
            email: "",
            guests: [],
            formValidation: null,
            loading: false
        }
        
        this.setState(initialState);
    }

    addGuest () {
        this.setState((prevState) => ({
            guests: [...prevState.guests, {name:"", isAdult:true}],
          }));
    }

    handleChange (event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    handleGuestChange (event, index) {
        let guests = [...this.state.guests];
        guests[index].name = event.target.value;

        this.setState({
            guests: guests
        });
    }

    handleSubmit () {
        if (this.state.name !== "" && this.state.phone !== "" && this.state.email !== "") {
            let data = this.state.name + " - " + this.state.phone + "<br>" + this.state.email;
            if (this.state.guests.length > 0)
                data += "<br><br>E seus convidados:<br>";
    
            for (let i = 0; i < this.state.guests.length; i++) {
                let guest = this.state.guests[i];
                if (guest.name !== "") {
                    data += guest.name;
        
                    if (!guest.isAdult)
                        data += " (Criança)";

                    data += "<br>";       
                }
            }           
            this.setState({loading: true});

            var self = this;

            emailjs.send("confirmacao_ro_e_vi", "template_Itm66SyS", {"message_html":data}, "user_lZxwF6H2GW4ymTWAPcV8Y")
                .then (function (response) {
                    alert ("Confirmação feita com sucesso!");
                    self.resetState();
                }, function (err) {
                    alert ("Erro no envio dos seus dados, favor tentar novamente!");
                    self.setState({loading: false});
                });

        } else {
            this.setState({
                formValidation: false
            });    
        }
    }

    handleGuestButton (e, index, isAdult) {
        let guests = [...this.state.guests];
        guests[index].isAdult = isAdult;

        this.setState({
            guests: guests
        });
    }

    render() {
        const renderGuestForm = this.state.guests.map((guest, i) => {
            return (
                <div key={i} className="guest-line">

                        <input
                            className="width-50-mobile"
                            id="name" 
                            name="name" 
                            type="text" 
                            placeholder="Nome Completo" 
                            onChange={(e) => this.handleGuestChange(e, i)} />

                    <div className="width-50-mobile">
                        <button 
                            className={'width-50 button-adult ' + (guest.isAdult ? 'button-selected' : '')} 
                            onClick={(e) => this.handleGuestButton(e, i, true)}>
                            Adulto
                        </button>
                        <button 
                            className={'width-50 button-adult ' + (!guest.isAdult ? 'button-selected' : '')} 
                            onClick={(e) => this.handleGuestButton(e, i, false)}>
                            Criança
                        </button>
                    </div>
                </div>
            )
        });

        return (
            <div>
                <Menu selected={4}/>
                <div className="page-container">
                    <div className="confirmation">
                        <h1 className="center-align">Confirmação</h1>
                        <div className="form-container">
                            {this.state.loading === true ?
                                <Loading /> : 
                                <div>
                                <p>Não esqueça de clicar em "Enviar" após preencher o formulário!</p>
                                <form>
                                    <input 
                                        id="name"
                                        className={(this.state.formValidation === false && this.state.name === "" ? 'validation-false' : '')}
                                        name="name" 
                                        type="text" 
                                        placeholder="Nome Completo" 
                                        value={this.state.name} 
                                        onChange={(e) => this.handleChange(e)} />
                                    <input 
                                        id="phone"
                                        className={(this.state.formValidation === false && this.state.phone === "" ? 'validation-false' : '')}
                                        name="phone" 
                                        type="tel" 
                                        placeholder="Telefone com DDD" 
                                        value={this.state.phone} 
                                        onChange={(e) => this.handleChange(e)} />
                                    <input 
                                        id="email"
                                        className={(this.state.formValidation === false && this.state.email === "" ? 'validation-false' : '')}
                                        name="email" 
                                        type="email" 
                                        placeholder="E-mail" 
                                        value={this.state.email} 
                                        onChange={(e) => this.handleChange(e)} />
                                </form>
                                <p>Para confirmar mais pessoas, clique no botão abaixo:</p>
                                <button className="button-add" onClick={(e) => this.addGuest()}>
                                    Adicionar Convidado
                                </button>

                                {renderGuestForm}
                                <p>
                                    <button className="button-submit" onClick={(e) => this.handleSubmit()}>
                                        Enviar
                                    </button>
                                </p>
                                </div>
                            }
                        </div>
                    </div>
                    
                </div>
            </div>
        );
    }
}

export default Confirmacao;