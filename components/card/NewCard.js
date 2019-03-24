import React, { Component } from 'react'
import { Container, Header, Content, Body, Title, Text, Form, Item, Input, Button, Toast } from 'native-base'
import { connect } from 'react-redux'
import * as ShortId from 'shortid'
import { NewCardAction } from '../../actions/CardActions'
import { saveCardToDeck } from '../../utils/storage'

class NewCard extends Component {
    state = {
        deck: null,
        question: '',
        answer: ''
    }

    componentDidMount(){
        const { navigation } = this.props
        const deckId = navigation.getParam('deckId', 'NO-ID')
        if(deckId && deckId !== 'NO-ID'){
            const deck = this.props.decks[deckId]
            this.updateDeck(deck)
        } else {
            Toast.show('Oops! Something went wrong. Please try again...')
        }
    }

    updateDeck(deck){
        this.setState({
            deck: deck
        })
    }

    onSubmit = () => {
        const { question, answer, deck } = this.state
        const cardId = ShortId.generate();
        
        this.props.dispatch(NewCardAction(deck.id, {[cardId]: {id: cardId, question: question, answer: answer}}))
        saveCardToDeck({deckId: deck.id, cards: {id: cardId, question: question, answer: answer}})
        Toast.show({text: 'Card saved!'})
        this.props.navigation.navigate('DeckDetail')
    }

    showToast = (msg) => {
        Toast.show({
            text: msg,
            type: 'danger'
        })
    }

    render(){
        const { question, answer } = this.state
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>
                            Add Card
                        </Title>
                    </Body>
                </Header>
                <Content padder>
                    <Form>
                        <Item padder>
                            <Input
                                name="quest"
                                placeholder="Question..."
                                onChangeText={(value)=> this.setState({question: value})}
                                value={question}
                                />
                        </Item>
                        <Item padder>
                            <Input
                                name="ans"
                                placeholder="Answer..."
                                onChangeText={(value)=> this.setState({answer: value})}
                                value={answer}
                                />
                        </Item>
                    </Form>
                    <Button block style={{ margin: 15, marginTop: 50 }} onPress={() => {this.onSubmit()}}>
                        <Text>Submit</Text>
                    </Button>
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = (store) => {
    return {
        decks: store.decks
    }
}

export default connect(mapStateToProps)(NewCard)