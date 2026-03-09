import {pool} from '../db/sql.js'


// Function to Show all spaces
export async function getSpaces() {
    const query = `select  s.name, s.description, s.status, sc.name 
                    from public.space s 
                    inner join public.scenario sc 
                    on sc.id = s.scenario_id`
    const {rows} = await pool.query(query)
    return rows;
}

//Function to filter by name (search bar)
export async function getSpaceByName(name) {
    const query = `select  s.name, s.description, s.status, sc.name as scenario
                    from public.space s 
                    inner join public.scenario sc 
                    on sc.id = s.scenario_id
                    where s.name ilike $1`
    const {rows} = await pool.query(query, [`%${name}%`]);
    return rows
}

//Function to filter by status
export async function getSpaceByStatus(status) {
    const query = `select  s.name, s.description, s.status, sc.name as scenario
                    from public.space s 
                    inner join public.scenario sc 
                    on sc.id = s.scenario_id
                    where s.status = $1`
    const {rows} = await pool.query(query, [status]);
    return rows
}

//Function to create a new space
export async function createSpace(name, description, scenario) {
    const query =`insert into public.space (name, description, scenario_id)
                    values ($1, $2,(select sc.id from scenario sc where sc.name = $3 ))
                    RETURNING *`
    const {rows} = await pool.query(query,[name, description,scenario])
    return rows[0]
}

//Function to delete a space
export async function deleteSpace (name,scenario_name){
    const query = `DELETE FROM public.space 
                    WHERE name=$1 and scenario_id=(select sc.id from scenario sc where sc.name = $2 )
                    RETURNING *`
    const {rows} = await pool.query(query, [name, scenario_name]);
    return rows[0] || null
}


//Function to update an space
async const updateSpace =async (req,res) =>{
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