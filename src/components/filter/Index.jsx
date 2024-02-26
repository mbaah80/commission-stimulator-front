
export const Index = ({ startDate, endDate, staffMember, action }) => {


    return (
        <div>
            <h1>Staff Member: {staffMember}</h1>
            <h2>Start Date: {startDate}</h2>
            <h2>End Date: {endDate}</h2>
            <h2>Action: {action}</h2>
        </div>
    );
};

export default Index;
