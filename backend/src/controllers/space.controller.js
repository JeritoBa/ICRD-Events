import {pool} from '../db/sql.js'

export const getSpaces = async (req,res) =>{
    const {rows} = await pool.query('SELECT * FROM test.patient')
    res.json(rows)
}

export const getSpace =  async (req,res) =>{
    const {id} = req.params;
    const query = 'SELECT * FROM test.patient WHERE id=$1'

    try{
        const response = await pool.query(query, [id]);
        res.json(response.rows);
    } catch (error){
        console.error('Error getting the patient: ', error)
        res.status(404).json({message: 'Patient not found'})
    }
}

export const createSpace = async (req,res) =>{
    //datos que ingresa el cliente
    const {name, birth_date} = req.body
    const query = 'INSERT INTO test.patient (name, birth_date) VALUES ($1,$2) RETURNING *'

    try{
        const response = await pool.query(query, [name, birth_date]);
        res.status(201).json({ message: 'Patient created successfully'})
    } catch (error){
        console.error('Error creating the patient: ', error)
        res.status(404).json({message: 'Error creating the patient'})
    }
}

export const deleteSpace = async (req,res) =>{
    const {id} = req.params;
    const query = 'DELETE FROM test.patient WHERE id=$1'

    try{
        const response = await pool.query(query, [id]);
        if (response.rowCount ===0){
            return res.status(404).json({message: 'Patient not found'})
        }

        res.json({
            message: 'Patient deletd succesfully',
            patient: response.rows[0]
        });
    } catch (error){
        console.error('Error deleting the patient: ', error)
        res.status(404).json({message: 'Internal server error'})
    }
}

export const updateSpace =async (req,res) =>{
    const {id} = req.params;
    const {name, birth_date} = req.body

    const query = 'UPDATE test.patient SET name= $1, birth_date=$2 WHERE id=$3 RETURNING *'

    try{
        const response = await pool.query(query, [name, birth_date,id]);
        response.rows[0]
        res.status(200).json({ message: 'Patient updated successfully'})
    } catch (error){
        console.error('Error creating the patient: ', error)
        res.status(404).json({message: 'Error updating the patient'})
    }
}